import NitroFS from 'react-native-nitro-fs'

const TICKET_PHOTOS_DIRECTORY_NAME = 'ticket-photos'

function getTicketPhotosDirectory() {
  return `${NitroFS.DOCUMENT_DIR}/${TICKET_PHOTOS_DIRECTORY_NAME}`
}

export async function persistTicketPhoto(photo: string, ticketId: string) {
  if (!photo.startsWith('data:image/')) return photo

  const separatorIndex = photo.indexOf(',')
  if (separatorIndex < 0) {
    throw new Error('La foto del ticket no tiene un formato válido.')
  }

  const directory = getTicketPhotosDirectory()
  if (!(await NitroFS.exists(directory))) await NitroFS.mkdir(directory)
  const path = `${directory}/${ticketId}.jpg`
  await NitroFS.writeFile(path, photo.slice(separatorIndex + 1), 'base64')
  return path.startsWith('file://') ? path : `file://${path}`
}

export async function clearPersistedTicketPhotos() {
  const directory = getTicketPhotosDirectory()
  if (await NitroFS.exists(directory)) await NitroFS.unlink(directory)
}
