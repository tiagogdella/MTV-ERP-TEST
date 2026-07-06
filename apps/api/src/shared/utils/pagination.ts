export interface PaginationQuery {
  page?: number
  limit?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export function buildPaginationQuery(page = 1, limit = 20) {
  const take = limit
  const skip = (page - 1) * limit
  return { take, skip }
}
