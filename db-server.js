// import { randomUUID } from "node:crypto"
// import { sql } from "./db.js"

// export class DatabaseMySQL {

//   async list(search) { // 'async' is being used beacause of the necessity of utilizing the 'await' command
//     let videos

//     if (search) {
//       videos = await sql`select * from videos where title ilike ${'%' + search + '%'}` // 'await' tells the code to wait untill the 'sql' instruction completes execution.
//     } else {
//       videos = await sql`select * from videos`
//     }

//     return videos
//   }

//   async create(video) {
//     const videoId = randomUUID()
//     const { title, description, duration } = video

//     await sql`insert into videos (id, title, description, duration) VALUES (${videoId}, ${title}, ${description}, ${duration})`
//   }

//   async update(id, video) {
//     const { title, description, duration } = video
//     await sql`update videos set title = ${title}, description = ${description}, duration = ${duration} WHERE id = ${id}`
//   }

//   async delete(id) {
//     await sql`delete from videos where id = ${id}`
//   }
// }


// Adapting the code to work with 'mysql2' library

import { randomUUID } from 'node:crypto'
import { sql } from './db.js'

export class DatabaseMySQL {
  async list(search) {
    let query = 'SELECT * FROM videos'
    let params = []

    if (search) {
      query += ' WHERE title LIKE ?'
      params.push(`%${search}%`)
    }

    const [rows] = await sql.execute(query, params)
    return rows
  }

  async create(video) {
    const videoId = randomUUID()
    const { title, description, duration } = video

    const query = `
      INSERT INTO videos (videoId, title, description, duration)
      VALUES (?, ?, ?, ?)
    `
    const params = [videoId, title, description, duration]

    await sql.execute(query, params)
  }

  async update(id, video) {
    const { title, description, duration } = video

    const query = `
      UPDATE videos
      SET title = ?, description = ?, duration = ?
      WHERE videoId = ?
    `
    const params = [title, description, duration, id]

    await sql.execute(query, params)
  }

  async delete(id) {
    const query = 'DELETE FROM videos WHERE videoId = ?'
    const params = [id]

    await sql.execute(query, params)
  }
}
