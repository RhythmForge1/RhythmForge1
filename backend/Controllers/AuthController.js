const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User");


const signup = async (req, res) => {

        try {
            const { name, email, password, projectCode, userType, accessType, role, businessJustification, sapId, lineManagerEmail } = req.body;
    
            // Validate userType
            if (!['Internal', 'Vendor'].includes(userType)) {
                return res.status(400).json({
                    message: 'Invalid user type. Must be "Internal" or "Vendor".',
                    success: false,
                });
            }
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const userPayload = {
            name,
            email,
            password: await bcrypt.hash(password, 10),
            projectCode,
            userType,
            accessType,
            role,
            lineManagerEmail,
        };

        // Include `sapId` and `businessJustification` only if the userType is 'Internal'
        if (userType === 'Internal') {
            userPayload.sapId = sapId;
            userPayload.businessJustification = businessJustification;
        }

        // Create and save user
        const newUser = new UserModel(userPayload);
        await newUser.save();

        res.status(201).json({
            message: "Signup successful",
            success: true,
        });
    } catch (err) {
        console.error('Error during signup:', err); // Log error to console
        res.status(500)
            .json({
                message: "Internal server error",
                success: false,
                error: err.message // Include error details in the response (optional, for debugging)
            });
    }
}


const login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;
                // Validate userType
                if (!['Internal', 'Vendor'].includes(userType)) {
                    return res.status(400).json({
                        message: 'Invalid user type. Must be "Internal" or "Vendor".',
                        success: false,
                    });
                }
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
              // Verify userType matches
              if (user.userType !== userType) {
                return res.status(403).json({
                    message: `Authentication failed. User is not registered as a "${userType}".`,
                    success: false,
                });
            }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        // Determine homepage based on the role
        let redirectPage = "InternalHomepage"; // Default page for Internal users
        if (user.role === "Scrum Master" || user.role === "QA Analyst") {
            redirectPage = "EmpHomepage";
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({
            _id: user._id,
            message: "Login successful",
            success: true,
            jwtToken,
            name: user.name,
            userType: user.userType,
            redirectPage,
            totalPoints: user.totalPoints, // Send total points
            level: user.level, // Send user level
            badges: user.badges, // Send earned badges
        });
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

module.exports = {
    signup,
    login
}