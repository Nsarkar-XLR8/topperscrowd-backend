import { IBook } from "../book/book.interface";

export interface ILibraryStats {
  totalAudiobooks: number;
  newAudiobooks: number;
  totalListeningTime: number; // in seconds or hours? Let's return seconds and frontend can format.
  listeningTimeThisWeek: number;
  favorites: number;
  addedFavorites: number;
}

export interface IContinueListening {
  book: IBook;
  progress: number;
  totalDuration: number;
  lastListenedAt: Date;
}

export interface ILibraryResponse<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
