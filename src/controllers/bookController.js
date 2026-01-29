
if (req.isAuthenticated()) {
    
    bookData.createdBy = req.user.id;
}


const getUserBooks = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }
    
    try {
        const books = await Book.find({ createdBy: req.user.id });
        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};