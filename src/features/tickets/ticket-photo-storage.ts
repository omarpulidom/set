import { Directory, EncodingType, File, Paths } from 'expo-file-system'

const TICKET_PHOTOS_DIRECTORY_NAME = 'ticket-photos'

function getTicketPhotosDirectory() {
  const directory = new Directory(Paths.document, TICKET_PHOTOS_DIRECTORY_NAME)
  directory.create({
    idempotent: true,
    intermediates: true,
  })
  return directory
}

export function persistTicketPhoto(photo: string, ticketId: string) {
  if (!photo.startsWith('data:image/')) return photo

  const separatorIndex = photo.indexOf(',')
  if (separatorIndex < 0) {
    throw new Error('La foto del ticket no tiene un formato válido.')
  }

  const file = new File(getTicketPhotosDirectory(), `${ticketId}.jpg`)
  file.create({
    intermediates: true,
    overwrite: true,
  })
  file.write(photo.slice(separatorIndex + 1), {
    encoding: EncodingType.Base64,
  })
  return file.uri
}

export function clearPersistedTicketPhotos() {
  const directory = new Directory(Paths.document, TICKET_PHOTOS_DIRECTORY_NAME)
  if (directory.exists) directory.delete()
}
