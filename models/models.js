const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Course = sequelize.define("course", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true},
    price: {type: DataTypes.INTEGER},
    description: {type: DataTypes.TEXT},
    date: {type: DataTypes.STRING}
})

const Branch = sequelize.define("branch", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    img: {type: DataTypes.STRING},
    text: {type: DataTypes.STRING}
})

const WillLearn = sequelize.define("willLearn", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING},
})

const ForWhomCourse = sequelize.define("forWhomCourse", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING},
})

const Lesson = sequelize.define("lesson", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    description: {type: DataTypes.TEXT},
})


const Event = sequelize.define("event", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true},
    month: {type: DataTypes.STRING},
    day: {type: DataTypes.INTEGER},
    time: {type: DataTypes.STRING},
    date: {type: DataTypes.DATEONLY}
})

const EventType = sequelize.define("eventType", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
})

const Theme = sequelize.define("theme", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
})

const ForWhomEvent = sequelize.define("forWhomEvent", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING},
})

const Curator = sequelize.define("curator", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    jobTitle: {type: DataTypes.STRING},
    rate: {type: DataTypes.FLOAT},
    description: {type: DataTypes.TEXT},
    students: {type: DataTypes.INTEGER},
    img: {type: DataTypes.STRING}
})

const Blog = sequelize.define("blog", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.TEXT, unique: true},
    month: {type: DataTypes.STRING},
    day: {type: DataTypes.INTEGER},
    img: {type: DataTypes.STRING},
    mainText: {type: DataTypes.TEXT},
    firstText: {type: DataTypes.TEXT},
    secondText: {type: DataTypes.TEXT},
    summary: {type: DataTypes.TEXT}
})

const BlogType = sequelize.define("blogType", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING}
})

const ArticleElementList = sequelize.define("articleElementList", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.TEXT},
})

const ArticleElement = sequelize.define("articleElement", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    article: {type: DataTypes.TEXT},
    text: {type: DataTypes.TEXT},
})

const VideoElement = sequelize.define("videoElement", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    url: {type: DataTypes.STRING},
    time: {type: DataTypes.INTEGER}
})

const PodcastElement = sequelize.define("podcastElement", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    audio: {type: DataTypes.STRING},
    time: {type: DataTypes.INTEGER}
})

const Tag = sequelize.define("tag", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.TEXT},
})

const User = sequelize.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    name: {type: DataTypes.STRING},
    surname: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"}
})

const FormSubmission = sequelize.define("formSubmission", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.STRING(32), allowNull: false},
    email: {type: DataTypes.STRING(254), allowNull: false},
    name: {type: DataTypes.STRING(160)},
    phone: {type: DataTypes.STRING(64)},
    message: {type: DataTypes.TEXT},
    source: {type: DataTypes.STRING(2048)},
}, {
    tableName: 'form_submissions',
    indexes: [
        {fields: ['type']},
        {fields: ['email']},
        {fields: ['createdAt']},
    ],
})


Branch.hasMany(Tag, {as: "tags", foreignKey: "branchId"})
Tag.belongsTo(Branch)

Curator.hasMany(Blog)
Blog.belongsTo(Curator)

Branch.hasMany(Blog)
Blog.belongsTo(Branch)

ArticleElement.hasMany(ArticleElementList, {as: "articleElementList", foreignKey: "articleElementId"})
ArticleElementList.belongsTo(ArticleElement)

BlogType.hasMany(Blog)
Blog.belongsTo(BlogType)

Blog.hasOne(ArticleElement, {as: "articleElement", foreignKey: "blogId"})
ArticleElement.belongsTo(Blog)

Blog.hasOne(VideoElement, {as: "videoElement", foreignKey: "blogId"})
VideoElement.belongsTo(Blog)

Blog.hasOne(PodcastElement, {as: "podcastElement", foreignKey: "blogId"})
PodcastElement.belongsTo(Blog)

Branch.hasMany(Course)
Course.belongsTo(Branch)

Course.hasMany(Lesson)
Lesson.belongsTo(Course)

Course.hasMany(ForWhomCourse, {as: "forWhom", foreignKey: "courseId"})
ForWhomCourse.belongsTo(Course)

Course.hasMany(WillLearn, {as: "willLearn", foreignKey: "courseId"})
WillLearn.belongsTo(Course)

EventType.hasMany(Event)
Event.belongsTo(EventType)

Event.hasMany(Theme, {as: "theme", foreignKey: "eventId"})
Theme.belongsTo(Event)

Event.hasMany(ForWhomEvent, {as: "forWhom", foreignKey: "eventId"})
ForWhomEvent.belongsTo(Event)

Curator.hasMany(Event)
Event.belongsTo(Curator)

Curator.hasMany(Course)
Course.belongsTo(Curator)


module.exports = {
    EventType,
    Event,
    Theme,
    ForWhomEvent,
    WillLearn,
    ForWhomCourse,
    Lesson,
    Course,
    Branch,
    Curator,
    Blog,
    BlogType,
    ArticleElementList,
    ArticleElement,
    VideoElement,
    PodcastElement,
    Tag,
    User,
    FormSubmission
}
