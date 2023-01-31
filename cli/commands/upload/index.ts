import { CommandHandler } from '../..'
import { assertExists } from '../../utils'
import { AppendToFile } from '../../utils/append.to.file'
import { UploadManifest } from '../publish/upload.manifest'
import { GetCredentials } from '../../utils/get.credentials'

export default function provideUpload(
  getCredentials: GetCredentials,
  uploadManifest: UploadManifest,
  appendToFile: AppendToFile,
  args: any
): CommandHandler {
  assertExists(uploadManifest, 'uploadManifest')
  assertExists(appendToFile, 'appendToFile')
  assertExists(args, 'args')

  return async function upload() {
    if (!args.imageRef) {
      console.error('--imageRef not provided - aborting')
      return
    }

    let privateKey;
    if (args.privateKey) {
      privateKey = args.privateKey
    } else {
      const creds = await getCredentials()
      privateKey = creds.privateKey
    }

    const manifestReference = await uploadManifest(args.imageRef, privateKey)

    let logMessage = `${new Date().toUTCString()}: successfully uploaded manifest with reference ${manifestReference}`
    if (args.refOnly) {
      logMessage = manifestReference
    }
    console.log(logMessage)
    appendToFile(logMessage, 'publish.log')
  } 
}
