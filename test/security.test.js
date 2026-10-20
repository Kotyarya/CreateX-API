process.env.RANDOM_KEY = 'test-secret-that-is-at-least-32-characters'
process.env.CORS_ORIGINS = 'https://allowed.example'

const {test} = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = require('../app')
const {Course, User, FormSubmission} = require('../models/models')
const {validateEnv} = require('../config/env')

const withStub = async (target, method, replacement, callback) => {
    const original = target[method]
    target[method] = replacement
    try {
        return await callback()
    } finally {
        target[method] = original
    }
}

test('health endpoint reports readiness without exposing internals', async () => {
    const response = await request(app).get('/api/health').expect(200)
    assert.deepEqual(response.body, {status: 'ok'})
    assert.equal(response.headers['x-powered-by'], undefined)
})

test('mutating content requires authentication', async () => {
    const response = await request(app).post('/api/course').send({title: 'Blocked'}).expect(401)
    assert.deepEqual(response.body, {message: 'Unauthorized'})
})

test('regular users cannot mutate content', async () => {
    const token = jwt.sign({id: 1, role: 'USER'}, process.env.RANDOM_KEY)
    const response = await request(app)
        .post('/api/course')
        .set('Authorization', `Bearer ${token}`)
        .send({title: 'Blocked'})
        .expect(403)
    assert.deepEqual(response.body, {message: 'Forbidden'})
})

test('CORS only allows configured browser origins', async () => {
    await request(app).get('/api/health').set('Origin', 'https://allowed.example').expect(200)
    const response = await request(app).get('/api/health').set('Origin', 'https://blocked.example').expect(403)
    assert.deepEqual(response.body, {message: 'Request rejected'})
})

test('invalid public form data is rejected before database access', async () => {
    const response = await request(app).post('/api/email/subscribe').send({email: 'invalid'}).expect(400)
    assert.equal(response.body.message, 'Invalid email')
})

test('public forms persist normalized submissions without exposing a read endpoint', async () => {
    const submissions = []

    await withStub(FormSubmission, 'create', async (input) => {
        submissions.push(input)
        return {id: submissions.length, ...input}
    }, async () => {
        await request(app)
            .post('/api/email/subscribe')
            .set('Referer', 'https://createx.example/home')
            .send({email: '  Student@Example.com  '})
            .expect(200)

        await request(app).post('/api/email/sendMessage').send({
            email: 'student@example.com',
            name: ' Test Student ',
            phone: '',
            message: ' I would like more information. ',
        }).expect(200)

        await request(app).post('/api/email/register').send({
            email: 'student@example.com',
            name: 'Test Student',
            phone: '+48 123 456 789',
        }).expect(200)
    })

    assert.deepEqual(submissions, [
        {
            type: 'subscription',
            email: 'student@example.com',
            source: 'https://createx.example/home',
        },
        {
            type: 'contact',
            email: 'student@example.com',
            name: 'Test Student',
            phone: null,
            message: 'I would like more information.',
            source: null,
        },
        {
            type: 'registration',
            email: 'student@example.com',
            name: 'Test Student',
            phone: '+48 123 456 789',
            source: null,
        },
    ])

    await request(app).get('/api/email/submissions').expect(404)
})

test('registration and login issue user tokens without granting admin access', async () => {
    const passwordHash = bcrypt.hashSync('password123', 4)
    let storedUser

    await withStub(User, 'findOne', async ({where: {email}}) => storedUser?.email === email ? storedUser : null, async () => {
        await withStub(User, 'create', async (input) => {
            storedUser = {id: 42, ...input}
            return storedUser
        }, async () => {
            const registration = await request(app).post('/api/user/reg').send({
                email: 'student@example.com',
                password: 'password123',
                name: 'Test',
                surname: 'Student',
            }).expect(200)
            assert.equal(jwt.verify(registration.body.token, process.env.RANDOM_KEY).role, 'USER')

            storedUser.password = passwordHash
            const login = await request(app).post('/api/user/login').send({
                email: 'student@example.com',
                password: 'password123',
            }).expect(200)
            assert.equal(jwt.verify(login.body.token, process.env.RANDOM_KEY).id, 42)
        })
    })
})

test('an administrator can create content through the protected CRUD route', async () => {
    const token = jwt.sign({id: 1, role: 'ADMIN'}, process.env.RANDOM_KEY)
    const payload = {
        title: 'Secure course',
        price: 100,
        branchId: 1,
        curatorId: 1,
        description: 'Test description',
        date: '2026-10-20',
    }

    await withStub(Course, 'create', async (input) => ({id: 99, ...input}), async () => {
        const response = await request(app)
            .post('/api/course')
            .set('Authorization', `Bearer ${token}`)
            .send(payload)
            .expect(200)
        assert.deepEqual(response.body, {id: 99, ...payload})
    })
})

test('production configuration fails closed when required secrets are absent', () => {
    const keys = ['DATABASE_URL', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'RANDOM_KEY',
        'CORS_ORIGINS', 'NODE_ENV']
    const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]))

    try {
        for (const key of keys) delete process.env[key]
        process.env.NODE_ENV = 'production'
        assert.throws(validateEnv, /Missing or invalid environment configuration/)
    } finally {
        for (const key of keys) {
            if (original[key] === undefined) delete process.env[key]
            else process.env[key] = original[key]
        }
    }
})
