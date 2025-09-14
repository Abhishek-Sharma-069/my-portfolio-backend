const PortfolioData = require('../models/portfolioModel');

// Helper function to ensure PortfolioData document exists
const ensurePortfolioDataExists = async () => {
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

    let data = await PortfolioData.findOne();

    if (!data) {
        // If no data exists, create a new document with default data
        data = new PortfolioData(defaultData);
        await data.save();
    } else {
        // If data exists, but sections or formFields are empty, update them
        if (!data.experience.sections || data.experience.sections.length === 0) {
            data.experience.sections = defaultData.experience.sections;
        }
        if (!data.contact.formFields || data.contact.formFields.length === 0) {
            data.contact.formFields = defaultData.contact.formFields;
        }
        await data.save();
    }
    return data;
};

const getPortfolioData = async (req, res) => {
    try {
        const data = await ensurePortfolioDataExists();
        res.json(data);
    } catch (error) {
        console.error('Error in getPortfolioData:', error);
        res.status(500).json({ message: error.message });
    }
};

const updatePortfolioData = async (req, res) => {
    try {
        const updatedData = await PortfolioData.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(updatedData);
    } catch (error) {
        console.error('Error in updatePortfolioData:', error);
        res.status(400).json({ message: error.message });
    }
};

// Project controllers
const addProject = async (req, res) => {
    try {
        console.log('📝 Add Project - Request body:', req.body);
        console.log('📁 Add Project - Request file:', req.file ? 'File received' : 'No file');
        
        const { title, description, buttonText, buttonLink } = req.body;
        const image = req.file ? req.file.secure_url : '';

        console.log('🖼️ Image URL:', image);

        const data = await ensurePortfolioDataExists();
        const newProject = { title, description, image, buttonText, buttonLink };
        data.projects.push(newProject);
        await data.save();
        
        res.status(201).json({ 
            message: 'Project added successfully',
            project: newProject,
            projects: data.projects 
        });
    } catch (error) {
        console.error('Error in addProject:', error);
        res.status(400).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        console.log('📝 Update Project - Request body:', req.body);
        console.log('📁 Update Project - Request file:', req.file ? 'File received' : 'No file');
        
        const { id } = req.params;
        const { title, description, buttonText, buttonLink } = req.body;
        
        const data = await ensurePortfolioDataExists();
        const project = data.projects.id(id);
        if (project) {
            console.log('🔍 Current project image:', project.image);
            
            project.title = title;
            project.description = description;
            project.buttonText = buttonText;
            project.buttonLink = buttonLink;
            
            // Only update image if a new file is uploaded
            if (req.file) {
                console.log('🖼️ New image URL:', req.file.secure_url);
                console.log('📁 File details:', {
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    secure_url: req.file.secure_url
                });
                
                // Delete old image from Cloudinary if it exists
                if (project.image && project.image.includes('cloudinary.com')) {
                    try {
                        const cloudinary = require('../config/cloudinary');
                        // Extract public_id from URL
                        const urlParts = project.image.split('/');
                        const publicId = urlParts[urlParts.length - 1].split('.')[0];
                        await cloudinary.uploader.destroy(`portfolio/${publicId}`);
                        console.log('🗑️ Old image deleted from Cloudinary');
                    } catch (cloudinaryError) {
                        console.error('Error deleting old image from Cloudinary:', cloudinaryError);
                        // Continue with update even if old image deletion fails
                    }
                }
                project.image = req.file.secure_url;
                console.log('✅ Project image updated to:', project.image);
            } else {
                console.log('📷 No new image uploaded, keeping existing image:', project.image);
            }
            // If no new file is uploaded, keep the existing image (don't change it)
            
            await data.save();
            res.json({ 
                message: 'Project updated successfully',
                project: project, // Return the updated project
                projects: data.projects 
            });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error in updateProject:', error);
        res.status(400).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await ensurePortfolioDataExists();
        const project = data.projects.id(id);
        if (project) {
            // Delete image from Cloudinary if it exists
            if (project.image && project.image.includes('cloudinary.com')) {
                try {
                    const cloudinary = require('../config/cloudinary');
                    // Extract public_id from URL
                    const urlParts = project.image.split('/');
                    const publicId = urlParts[urlParts.length - 1].split('.')[0];
                    await cloudinary.uploader.destroy(`portfolio/${publicId}`);
                } catch (cloudinaryError) {
                    console.error('Error deleting image from Cloudinary:', cloudinaryError);
                    // Continue with project deletion even if image deletion fails
                }
            }
            
            project.deleteOne();
            await data.save();
            res.json({ 
                message: 'Project deleted successfully',
                projects: data.projects 
            });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error in deleteProject:', error);
        res.status(400).json({ message: error.message });
    }
};

// Experience controllers
const addExperience = async (req, res) => {
    try {
        const { section, company, organization, role, duration, description } = req.body;
        const data = await ensurePortfolioDataExists();
        const expSection = data.experience.sections.find(s => s.type === section);
        
        if (expSection) {
            const newExperience = {
                company: company || '',
                organization: organization || '',
                role,
                duration,
                description
            };
            expSection.items.push(newExperience);
            await data.save();
            res.status(201).json({ 
                message: 'Experience added successfully',
                experience: data.experience 
            });
        } else {
            res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        console.error('Error in addExperience:', error);
        res.status(400).json({ message: error.message });
    }
};

const updateExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { section, company, organization, role, duration, description } = req.body;
        const data = await ensurePortfolioDataExists();
        const expSection = data.experience.sections.find(s => s.type === section);
        
        if (expSection) {
            const expItem = expSection.items.id(id);
            if (expItem) {
                expItem.company = company || '';
                expItem.organization = organization || '';
                expItem.role = role;
                expItem.duration = duration;
                expItem.description = description;
                await data.save();
                res.json({ 
                    message: 'Experience updated successfully',
                    experience: data.experience 
                });
            } else {
                res.status(404).json({ message: 'Experience item not found' });
            }
        } else {
            res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        console.error('Error in updateExperience:', error);
        res.status(400).json({ message: error.message });
    }
};

const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { section } = req.body;
        const data = await ensurePortfolioDataExists();
        const expSection = data.experience.sections.find(s => s.type === section);
        
        if (expSection) {
            const expItem = expSection.items.id(id);
            if (expItem) {
                expItem.deleteOne();
                await data.save();
                res.json({ 
                    message: 'Experience deleted successfully',
                    experience: data.experience 
                });
            } else {
                res.status(404).json({ message: 'Experience item not found' });
            }
        } else {
            res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        console.error('Error in deleteExperience:', error);
        res.status(400).json({ message: error.message });
    }
};

// Resume controller
const updateResume = async (req, res) => {
    try {
        const data = await ensurePortfolioDataExists();
        
        // Delete old resume from Cloudinary if it exists and a new one is being uploaded
        if (req.file && data.resumeUrl && data.resumeUrl.includes('cloudinary.com')) {
            try {
                const cloudinary = require('../config/cloudinary');
                // Extract public_id from URL
                const urlParts = data.resumeUrl.split('/');
                const publicId = urlParts[urlParts.length - 1].split('.')[0];
                await cloudinary.uploader.destroy(`portfolio/${publicId}`);
            } catch (cloudinaryError) {
                console.error('Error deleting old resume from Cloudinary:', cloudinaryError);
                // Continue with resume update even if old file deletion fails
            }
        }
        
        const resumeUrl = req.file ? req.file.secure_url : data.resumeUrl;
        data.resumeUrl = resumeUrl;
        await data.save();
        res.json({ 
            message: 'Resume updated successfully',
            resumeUrl: data.resumeUrl 
        });
    } catch (error) {
        console.error('Error in updateResume:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPortfolioData,
    updatePortfolioData,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    updateResume
};