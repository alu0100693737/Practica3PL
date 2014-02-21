var assert = chai.assert;

suite('TESTS:', function() {
    test('Prueba con un HEADER', function() {
        var tokens = lexer('[AAAAA]');
assert.equal(tokens[0].type,'header');
    });
    test('Prueba con blanco', function() {
        var tokens = lexer(' ');
assert.equal(tokens[0].type,'blanks');
    });
    test('Prueba con un error', function() {
        var tokens = lexer('@%%!-!!!-!***¿-');
assert.equal(tokens[0].type,'error');
    });
    
     test(' Prueba con comentarios', function() {
        var token = lexer('; esto es un comentario');
assert.equal(token[0].type,'comments');
    });
});