import { add, delay } from './utils';

async function main() {
    const result = add(5, 3);
    console.log(`Sum: ${result}`);
    await delay(1000);
    console.log('Done waiting!');
}

main();