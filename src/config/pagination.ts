import { Request, Response, NextFunction } from 'express';

interface Pagination {
  perPage: number;
  currentPage: number;
  totalPages: number;
  totalDocumentCount: number;
  paginationURI: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      pagination: Pagination;
    }
  }
}

export const paginateResponse = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.pagination = {
    perPage: 50,
    currentPage: 1,
    totalPages: 1,
    totalDocumentCount: 1,
    paginationURI:
      'localhost:3009/api/v1/{userType}/{routeName}?currentPage={n}&perPage={n}',
  };

  if (req.query.perPage) {
    req.pagination.perPage = parseInt(req.query.perPage as string);
  }

  if (req.query.currentPage) {
    req.pagination.currentPage = parseInt(req.query.currentPage as string);
  }

  next();
};

export const configurePaginationParams = async (
  req: Request,
  totalDocumentCount = 1,
) => {
  req.pagination.totalDocumentCount = totalDocumentCount;
  req.pagination.totalPages = Math.ceil(
    totalDocumentCount / req.pagination.perPage,
  );
};
