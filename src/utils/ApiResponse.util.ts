import { type Response } from 'express'

class ApiResponse {
  constructor (
    public readonly code: number,
    public readonly message: string,
    public readonly data: any = {}
  ) {
    // If the status code does not start with 2, set error to true by default
    if (Math.floor(this.code / 100) !== 2) {
      this.data.error = this.data.error ?? true
    }
  }

  send (res: Response): Response {
    return res.status(this.code).json(this)
  }
}

export { ApiResponse }