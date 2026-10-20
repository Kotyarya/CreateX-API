require('dotenv').config()

const sequelize = require('../db')
const models = require('../models/models')
const {
    ArticleElement, ArticleElementList, Blog, BlogType, Branch, Course, Curator,
    Event, EventType, ForWhomCourse, ForWhomEvent, Lesson, PodcastElement,
    Tag, Theme, VideoElement, WillLearn,
} = models

const curators = [
    ['Cody Fisher', 'UX Designer, Curator of Design Course', '2d19e08f-7357-4826-827d-f9200f324916.png'],
    ['Kathryn Murphy', 'Analyst and Marketing specialist', 'e7ccbccf-3a1b-482d-9c60-fe3f8b29abb5.png'],
    ['Brooklyn Simmons', 'Curator of Development Course', '920bbcf3-4e08-4148-aab3-691b7f3fc713.png'],
    ['Dianne Russell', 'Founder and CEO', '7a10b6e0-4935-4593-a28e-a868c8476b2c.png'],
    ['Guy Hawkins', 'Graphic Designer, Curator of Design Course', '5e7e3961-8c42-4086-a5db-2471a20ad397.png'],
    ['Kristin Watson', 'Marketer, Curator of Marketing Course', '04ec936c-c6c6-4218-b462-63e9a1abe94a.png'],
    ['Leslie Alexander Li', 'Curator of HR & Recruting Course', '325f1f47-d451-463d-bd02-3da2cd71e4f4.png'],
    ['Marvin McKinney', 'PM, Curator of Management Course', '97f0c91e-620f-41f5-9d8c-7c36b00b2b9a.png'],
    ['Jerome Bell', 'Founder and Program Director', 'ecf28bdd-2c07-4ec0-b499-244074bc5f04.png'],
]

const branches = [
    ['Marketing', 'Digital strategy, paid acquisition, brand management and communications.', '57d0cb60-1daf-4ff6-98d7-7f678b998a5a.png'],
    ['Management', 'Practical management skills for products, teams and growing businesses.', '17839706-3722-444d-8655-da0d8cabe84e.png'],
    ['HR & Recruting', 'Recruiting, people operations and HR analytics for modern teams.', '052b55c2-e03b-4568-8421-b853da6554b8.png'],
    ['Design', 'Human-centered UX and visual design from working practitioners.', '6f4292ee-9f34-40ac-b0be-2b8d97e6767b.png'],
    ['Development', 'Software engineering foundations and scalable system architecture.', '21f21f3a-0505-41f7-8a6c-e755400c2349.png'],
]

const courses = [
    ['User Experience. Human-centered Design', 240, 'Design', 'Cody Fisher'],
    ['Human Resources – Selection and Recruitment', 150, 'HR & Recruting', 'Kathryn Murphy'],
    ['Highload Software Architecture', 600, 'Development', 'Brooklyn Simmons'],
    ['Business Development Management', 400, 'Management', 'Dianne Russell'],
    ['Graphic Design Basic', 500, 'Design', 'Guy Hawkins'],
    ['Brand Management & PR Communications', 530, 'Marketing', 'Kristin Watson'],
    ['HR Management and Analytics', 200, 'HR & Recruting', 'Leslie Alexander Li'],
    ['Product Management Fundamentals', 480, 'Management', 'Marvin McKinney'],
    ['The Ultimate Google Ads Training Course', 100, 'Marketing', 'Jerome Bell'],
]

const events = [
    [5, 'August', '11:00 – 14:00', 'Formation of the organizational structure of the company in the face of uncertainty.', 'Online master-class', '2027-08-05'],
    [24, 'July', '11:00 – 12:30', 'Building a customer service department. Best Practices.', 'Online lecture', '2027-07-24'],
    [16, 'July', '10:00 – 13:00', 'How to apply methods of speculative design in practice. Worldbuilding prototyping.', 'Online workshop', '2027-07-16'],
    [10, 'July', '09:00 – 14:00', 'Find and evaluate: search and assessment tools for candidates.', 'Online workshop', '2027-07-10'],
    [27, 'June', '15:00 – 19:00', 'Connection to Microsoft Excel and Google Sheets, Data Visualization in Power BI.', 'Online master-class', '2027-06-27'],
    [15, 'June', '10:00 – 12:00', 'Marketing or growth hacking: main differences and what business needs.', 'Online lecture', '2027-06-15'],
    [2, 'June', '11:00 – 13:00', 'How to brief a client and present your design to approve it from the first show.', 'Online lecture', '2027-06-02'],
    [29, 'May', '11:00 – 12:00', 'Who is a project manager and do I want to be PM?', 'Online lecture', '2027-05-29'],
    [18, 'May', '10:00 – 12:00', "The company's business page as an additional tool to support the announcement of vacancies.", 'Online lecture', '2027-05-18'],
]

const blogs = [
    ['What is traffic arbitrage and does it really make money?', 'September', 4, 'Marketing', 'Podcast', 'Pharetra, ullamcorper iaculis viverra parturient sed id sed. Convallis proin dignissim lacus, purus gravida.', '9007fe0b-25da-4cbd-934c-1e4a318cc940.png', 36],
    ['How to choose the first programming language for a beginner', 'September', 1, 'Development', 'Article', 'Turpis sed at magna laoreet gravida consequat tortor placerat. Gravida vitae aliquet enim egestas dui.', '8612cea9-0ebd-4d73-b6e3-081b1d5eda85.png', 4],
    ['Should you choose a creative profession if you are attracted to creativity?', 'August', 8, 'Design', 'Video', 'Curabitur nisl tincidunt eros venenatis vestibulum ac placerat. Tortor, viverra sed vulputate ultrices.', '49c6faaf-1419-484f-8d9b-9237cdaeb0d7.png', 40],
    ['HR statistics: job search, interviews, hiring and recruiting', 'August', 3, 'HR & Recruting', 'Article', 'Massa, lectus nibh consectetur aliquet nunc risus aenean. Leo hac netus bibendum diam.', '052b55c2-e03b-4568-8421-b853da6554b8.png', 4],
    ['What to do and who to talk to if you want to get feedback on the product', 'August', 2, 'Management', 'Video', 'Neque a, senectus consectetur odio in aliquet nec eu. Ultricies ac nibh urna urna sagittis faucibus.', '17839706-3722-444d-8655-da0d8cabe84e.png', 45],
    ['What are color profiles and how they work in graphic design', 'July', 28, 'Design', 'Podcast', 'Aliquam vulputate hendrerit quam sollicitudin urna enim viverra gravida. Consectetur urna arcu eleifend.', '6f4292ee-9f34-40ac-b0be-2b8d97e6767b.png', 36],
]

const detailText = 'You will work with practical examples, build a repeatable process and receive actionable feedback on every important step.'
const courseDescription = 'The course combines concise theory with practical assignments and feedback from an experienced industry curator.'
const curatorDescription = 'An experienced practitioner who turns current industry methods into clear, practical lessons and supports students throughout the program.'

async function upsertOne(model, where, values, transaction) {
    const [record, created] = await model.findOrCreate({where, defaults: values, transaction})
    if (!created) await record.update(values, {transaction})
    return record
}

async function seed() {
    await sequelize.authenticate()
    await sequelize.sync()

    await sequelize.transaction(async (transaction) => {
        const curatorByName = {}
        for (const [name, jobTitle, img] of curators) {
            curatorByName[name] = await upsertOne(Curator, {name}, {
                name, jobTitle, img, rate: 4.9, students: 350, description: curatorDescription,
            }, transaction)
        }

        const branchByName = {}
        for (const [name, text, img] of branches) {
            branchByName[name] = await upsertOne(Branch, {name}, {name, text, img}, transaction)
            for (const tagText of [name, 'Online learning', 'Career']) {
                await Tag.findOrCreate({where: {branchId: branchByName[name].id, text: tagText}, transaction})
            }
        }

        for (const [title, price, branchName, curatorName] of courses) {
            const course = await upsertOne(Course, {title}, {
                title, price, description: courseDescription, date: 'September 8 – November 2',
                branchId: branchByName[branchName].id, curatorId: curatorByName[curatorName].id,
            }, transaction)

            for (const text of ['Build a clear process you can apply to real projects.', 'Use current tools and proven industry practices.', 'Present your work and make decisions with confidence.', 'Create a portfolio-ready final assignment.']) {
                await WillLearn.findOrCreate({where: {courseId: course.id, text}, transaction})
            }
            for (const text of ['Beginners who want a structured start.', 'Professionals who want to strengthen practical skills.', 'Career changers preparing for their next role.']) {
                await ForWhomCourse.findOrCreate({where: {courseId: course.id, text}, transaction})
            }
            for (const lessonTitle of ['Introduction and goals', 'Core tools and workflow', 'Practice and feedback', 'Final project']) {
                await Lesson.findOrCreate({where: {courseId: course.id, title: lessonTitle}, defaults: {description: detailText}, transaction})
            }
        }

        const eventTypeByName = {}
        for (const name of ['Online lecture', 'Online workshop', 'Online master-class']) {
            eventTypeByName[name] = await upsertOne(EventType, {name}, {name}, transaction)
        }
        for (let index = 0; index < events.length; index += 1) {
            const [day, month, time, title, eventTypeName, date] = events[index]
            const speakerName = index === 0 ? 'Kathryn Murphy' : curators[index % curators.length][0]
            const event = await upsertOne(Event, {title}, {
                title, day, month, time, date, eventTypeId: eventTypeByName[eventTypeName].id,
                curatorId: curatorByName[speakerName].id,
            }, transaction)
            for (const themeTitle of ['Theme 1. Aliquet lectus urna viverra in odio.', 'Theme 2. Orci commodo, viverra orci mollis ut euismod.', 'Theme 3. Sagittis vitae facilisi rutrum amet mauris quisque vel.', 'Theme 4. In id dolor quis nunc, urna hendrerit pharetra.']) {
                await Theme.findOrCreate({where: {eventId: event.id, title: themeTitle}, defaults: {description: detailText}, transaction})
            }
            for (const text of ['Specialists developing practical skills.', 'Team leads and business owners.', 'Anyone considering a career change.']) {
                await ForWhomEvent.findOrCreate({where: {eventId: event.id, text}, transaction})
            }
        }

        const blogTypeByName = {}
        for (const name of ['Article', 'Video', 'Podcast']) {
            blogTypeByName[name] = await upsertOne(BlogType, {name}, {name}, transaction)
        }
        const audioFiles = ['27ba7bac-2c1f-4ea7-bcda-f2a57a50783c.mp3', '59de92be-b1f0-4fcb-b7d5-7921e78935b9.mp3']
        let podcastIndex = 0
        for (const [title, month, day, branchName, typeName, mainText, img, duration] of blogs) {
            const blog = await upsertOne(Blog, {title}, {
                title, month, day, img, mainText, firstText: detailText, secondText: courseDescription,
                summary: 'Use these ideas as a starting point, adapt them to your context and keep measuring the result.',
                branchId: branchByName[branchName].id, blogTypeId: blogTypeByName[typeName].id,
                curatorId: curatorByName['Jerome Bell'].id,
            }, transaction)
            if (typeName === 'Article') {
                const article = await upsertOne(ArticleElement, {blogId: blog.id}, {blogId: blog.id, article: detailText, text: courseDescription}, transaction)
                for (const text of ['Define the goal before choosing a tool.', 'Start small and validate the result.', 'Document what works and improve it.']) {
                    await ArticleElementList.findOrCreate({where: {articleElementId: article.id, text}, transaction})
                }
            } else if (typeName === 'Video') {
                await upsertOne(VideoElement, {blogId: blog.id}, {blogId: blog.id, url: '', time: duration}, transaction)
            } else {
                await upsertOne(PodcastElement, {blogId: blog.id}, {blogId: blog.id, audio: audioFiles[podcastIndex++], time: duration}, transaction)
            }
        }
    })

    const counts = {}
    for (const model of [Branch, Curator, Course, EventType, Event, BlogType, Blog]) counts[model.name] = await model.count()
    console.log('CreateX seed complete:', counts)
}

seed()
    .catch((error) => {
        console.error('CreateX seed failed:', error.message)
        process.exitCode = 1
    })
    .finally(() => sequelize.close())
