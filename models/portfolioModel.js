const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    title: String,
    description: String,
    socials: [{
        name: String,
        icon: String,
        url: String,
    }],
    formFields: [{
        id: { type: String, required: true },
        label: { type: String, required: true },
        type: { type: String, required: true },
        placeholder: { type: String, required: true },
        rows: { type: Number, default: undefined },
    }],
    submitButton: {
        label: String,
    },
});

const experienceItemSchema = new mongoose.Schema({
    company: String,
    role: String,
    duration: String,
    description: String,
    organization: String,
}, { _id: true }); // Ensure _id is generated

const experienceSectionSchema = new mongoose.Schema({
    type: String,
    items: [experienceItemSchema],
});

const experienceSchema = new mongoose.Schema({
    title: String,
    sections: [experienceSectionSchema],
});

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    buttonText: String,
    buttonLink: String,
}, { _id: true }); // Ensure _id is generated

const skillSchema = new mongoose.Schema({
    languages: [{
        name: String,
        icon: String,
        color: String,
    }],
    frameworksAndTechnologies: [{
        name: String,
        icon: String,
        color: String,
    }],
    toolsAndPlatforms: [{
        name: String,
        icon: String,
        color: String,
    }],
    databases: [{
        name: String,
        icon: String,
        color: String,
    }],
});

const PortfolioDataSchema = new mongoose.Schema({
    contact: contactSchema,
    experience: experienceSchema,
    projects: [projectSchema],
    skills: skillSchema,
    resumeUrl: String
});

const PortfolioData = mongoose.model('PortfolioData', PortfolioDataSchema);

module.exports = PortfolioData;
