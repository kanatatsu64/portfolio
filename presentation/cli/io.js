const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export async function input(message) {
    return new Promise(resolve => rl.question(message, resolve))
}
