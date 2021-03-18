import { handlers } from './handler'
import { input } from './io'

function unknown(command) {
    console.error('unknown command: ' + command)
}

export async function repl(session, serviceLocator) {
    while (true) {
        const command = await input('> ')
        if (command in handlers)
            await handlers[command](session, serviceLocator)
        else if (command == 'exit') 
            break
        else
            unknown(command)
    }
}
