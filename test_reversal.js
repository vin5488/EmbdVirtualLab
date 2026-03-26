const http = require('http');

const code = `
#include <stdio.h>
#include <string.h>

void reverseString(char *str)
{
    char *start = str;
    char *end = str + strlen(str) - 1;
    char temp;

    while (start < end)
    {
        temp = *start;
        *start = *end;
        *end = temp;

        start++;
        end--;
    }
}

int main()
{
    char str[101];

    printf("Enter a string: ");
    if(fgets(str, sizeof(str), stdin) == NULL) return 0;

    // Remove newline if present
    size_t len = strlen(str);
    if (len > 0 && str[len - 1] == '\\n')
    {
        str[len - 1] = '\\0';
    }

    reverseString(str);

    printf("Reversed String: %s\\n", str);

    return 0;
}
`;

function sendCompile(stdin) {
    return new Promise((resolve) => {
        const data = JSON.stringify({ source_code: code, stdin: stdin, target: 'native' });
        const req = http.request({
            hostname: 'localhost', port: 8080, path: '/compile',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
        }, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                resolve(JSON.parse(body));
            });
        });
        req.write(data);
        req.end();
    });
}

async function main() {
    console.log("Testing with empty stdin (dry-run):");
    let res = await sendCompile("");
    console.log(res);

    console.log("\\nTesting with stdin 'HELLO':");
    res = await sendCompile("HELLO\\n");
    console.log(res);
}

main();
