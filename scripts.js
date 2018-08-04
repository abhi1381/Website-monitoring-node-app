process.stdin.resume();
process.stdin.setEncoding('utf-8');
var stdIn = '';

process.stdin.on('data', function(input) {
    stdIn += input;
});

process.stdin.on("end" , function() {
    main(stdIn);
});

function main(input) {
    process.stdout.write(`${input}`);
}