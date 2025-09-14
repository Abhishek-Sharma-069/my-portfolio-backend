const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const PortfolioData = require('../models/portfolioModel');

const defaultData = {
    contact: {
        title: "Contact",
        description: "Feel free to reach out to me for collaborations, projects, or just to say hi!",
        socials: [
          { name: "LinkedIn", icon: "FaLinkedin", url: "https://www.linkedin.com/in/abhishek-sharma-069-i/" },
          { name: "Twitter", icon: "FaTwitter", url: "https://x.com/AbhishekShar069" },
          { name: "Instagram", icon: "FaInstagram", url: "https://www.instagram.com/pt_abhishek_sharma_069/" },
          { name: "Facebook", icon: "FaFacebook", url: "https://www.facebook.com/profile.php?id=100026510589313" },
          { name: "GitHub", icon: "FaGithub", url: "https://github.com/Abhishek-Sharma-069" },
          { name: "Discord", icon: "FaDiscord", url: "https://discordapp.com/users/abhisheksharma069" }
        ],
        formFields: [
          {
            id: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter your name"
          },
          {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter your email"
          },
          {
            id: "message",
            label: "Message",
            type: "textarea",
            placeholder: "Enter your message",
            rows: 5
          }
        ],
        submitButton: {
          label: "Send Message"
        }
    },
    experience: {
        title: "Experience",
        sections: [
          {
            type: "Work",
            items: [
              {
                company: "----",
                role: "---",
                duration: "Future",
                description: "---"
              }
            ]
          },
          {
            type: "Internship",
            items: [
              {
                company: "Growth Ninja Pvt. Ltd.",
                role: " App Developer Intern",
                duration: "July 2024 to Aug 2024",
                description: "Worked on a project related to Android development and learned about app development lifecycle."
              },
              {
                company: "United Global Info Services Pvt. Ltd.",
                role: "Intern",
                duration: "July 2023 to Aug 2023",
                description: "Learn c++ programming languages, and work on a project related to data structures and algorithms."
              }
            ]
          },
          {
            type: "Volunteership",
            items: [
              {
                organization: "GeeksForGeeks",
                role: "Campus Ambassador",
                duration: "July 2024 to Present",
                description: "As a Campus Ambassador, I am responsible for promoting GeeksforGeeks on campus, organizing events, and helping students with their queries."
              },
              {
                organization: "GSDC-UIT",
                role: "Member",
                duration: "January 2024 to Present",
                description: "GDSC is a community of developers and designers who are passionate about technology and want to make a difference in the world."
              }
            ]
          }
        ]
    },
    projects: [
      {
        title: "Portfolio Website",
        description: "A personal portfolio website showcasing my projects and skills, built using React and Tailwind CSS.",
        image: "",
        buttonText: "See Project",
        buttonLink: "#"
      }
    ],
    skills: {
        languages: [
          { name: "Java", icon: "FaJava", color: "text-red-500" },
          { name: "PHP", icon: "FaPhp", color: "text-blue-500" },
          { name: "JavaScript", icon: "FaJsSquare", color: "text-yellow-500" },
          { name: "Python", icon: "FaPython", color: "text-blue-400" },
          { name: "C", icon: "SiC", color: "text-blue-500" },
          { name: "C++", icon: "SiCplusplus", color: "text-blue-700" }
        ],
        frameworksAndTechnologies: [
          { name: "Android", icon: "FaAndroid", color: "text-green-500" },
          { name: "React", icon: "FaReact", color: "text-blue-500" },
          { name: "Node.js", icon: "FaNodeJs", color: "text-green-600" },
          { name: "Next.js", icon: "SiNextdotjs", color: "text-white" }
        ],
        toolsAndPlatforms: [
          { name: "Android Studio", icon: "FaAndroid", color: "text-blue-500" },
          { name: "Git", icon: "FaGitAlt", color: "text-red-500" },
          { name: "Docker", icon: "FaDocker", color: "text-blue-500" }
        ],
        databases: [
          { name: "MySQL", icon: "SiMysql", color: "text-teal-500" },
          { name: "MongoDB", icon: "SiMongodb", color: "text-green-500" }
        ]
    },
    resumeUrl: ""
};

const initPortfolioData = async () => {
    try {
        // Check if environment variables are set
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not set in environment variables');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for initialization');

        // Delete existing documents
        console.log('Cleaning existing data...');
        await PortfolioData.deleteMany({});
        console.log('Existing PortfolioData documents deleted.');

        // Create a new document with default data
        console.log('Creating new portfolio data...');
        const newPortfolioData = new PortfolioData(defaultData);
        
        // Validate the data before saving
        const validationError = newPortfolioData.validateSync();
        if (validationError) {
            console.error('Validation error:', validationError.message);
            console.error('Validation details:', JSON.stringify(validationError.errors, null, 2));
            process.exit(1);
        }
        
        await newPortfolioData.save();
        console.log('New PortfolioData document created with default data.');

        console.log('Portfolio data initialization completed successfully!');

    } catch (error) {
        console.error('Error during PortfolioData initialization:', error);
        if (error.name === 'ValidationError') {
            console.error('Validation details:', JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

initPortfolioData();
