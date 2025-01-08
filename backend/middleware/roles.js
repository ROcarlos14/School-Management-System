const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin role required.'
        });
    }
};

const isTeacher = (req, res, next) => {
    if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Teacher role required.'
        });
    }
};

const isStudent = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Student role required.'
        });
    }
};

module.exports = {
    isAdmin,
    isTeacher,
    isStudent
};
