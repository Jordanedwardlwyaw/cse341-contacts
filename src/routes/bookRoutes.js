// Add at the top:
const { isAuthenticated } = require('../middleware/auth');

// Update POST route:
router.route('/')
    .get(getAllBooks)
    .post(isAuthenticated, validateBook, createBook); // Changed

// Update PUT and DELETE routes:
router.route('/:id')
    .get(getBookById)
    .put(isAuthenticated, validateBook, updateBook) // Changed
    .delete(isAuthenticated, deleteBook); // Changed

// Add protected user route:
router.get('/user/my-books', isAuthenticated, getUserBooks);