import path from 'path'
import { BitBank } from './models'
import { formatMoneyToString } from './utils'

const fileName = process.argv[2]

const bitBank = new BitBank()

bitBank.loadOperationsFromFile(path.join(__dirname, fileName))

bitBank.processOperations().then(fees => fees.map(fee => console.log(formatMoneyToString(fee))))
