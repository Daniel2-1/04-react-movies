import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  // Закрытие по ESC + блокировка скролла тела
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // запретить скролл страницы
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // cleanup: вернуть как было
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Закрытие по клику на backdrop, но не на саму модалку
  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.currentTarget === e.target) onClose();
  };

  const modalRoot = document.getElementById("modal") as HTMLDivElement;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        <img
          className={css.image}
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          }
          alt={movie.title}
          loading="lazy"
        />

        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
