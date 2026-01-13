
global.window = {}; // Mock window
try {
    require('./js/data.js');
    console.log('Syntax OK');
} catch (e) {
    console.error('Syntax Error:', e.message);
}
