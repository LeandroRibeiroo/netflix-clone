import {
  PlusIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import MUIModal from '@mui/material/Modal';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaPlay } from 'react-icons/fa';
import { HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';
import ReactPlayer from 'react-player/lazy';
import { useRecoilState } from 'recoil';
import { modalState, movieState } from '../atoms/modalAtom';
import useAuth from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { Genre, Movie } from '../typing';

interface VideoProps {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

const Modal = () => {
  const [muted, setMuted] = useState(true);
  const [trailer, setTrailer] = useState(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [like, setLike] = useState(false);
  const [hasTrailer, setHasTrailer] = useState(true);
  const [movie, setMovie] = useRecoilState(movieState);
  const [addedToList, setAddedToList] = useState(false);
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, 'customers', user.uid, 'myList'),
        (snapshot) => setMovies(snapshot.docs)
      );
    }
  }, [db, movie?.id]);

  // Check if the movie is already in the user's list
  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1
      ),
    [movies]
  );

  useEffect(() => {
    if (!movie) return;

    const fetchMovie = async () => {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === 'tv' ? 'tv' : 'movie'
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=pt-BR&append_to_response=videos`
      )
        .then((res) => res.json())
        .catch((error) => {
          alert('Erro ao carregar o trailer.');
          console.log('Erro ao carregar o trailer: ', error);
        });

      if (data?.videos) {
        const trailer = data.videos.results.find(
          (video: VideoProps) =>
            video.type === 'Trailer' || video.type === 'Teaser'
        );

        if (trailer) {
          setTrailer(trailer.key);
          setHasTrailer(true);
        } else {
          setHasTrailer(false);
          setTrailer(null);
        }
      }

      if (data?.genres) {
        setGenres(data.genres);
      }
    };

    fetchMovie();
  }, [movie]);

  const checkLanguage = () => {
    switch (movie?.original_language) {
      case 'en':
        return 'Inglês';

      case 'pt':
        return 'Português';

      case 'rus':
        return 'Russo';

      case 'es':
        return 'Espanhol';

      default:
        return 'Inglês';
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleAddOrRemoveFavorite = async () => {
    if (addedToList) {
      await deleteDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!)
      );

      toast(
        `${movie?.title || movie?.original_name} foi removido da sua lista.`,
        {
          duration: 4000,
        }
      );
    } else {
      await setDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!),
        {
          ...movie,
        }
      );

      toast(
        `${movie?.title || movie?.original_name} foi adicionado à sua lista.`,
        {
          duration: 4000,
        }
      );
    }
  };

  const handleLikeMovie = () => {
    setLike(!like);
  };

  return (
    <MUIModal
      open={showModal}
      onClose={handleClose}
      className="fixed !top-7 left-0 right-0 
      z-50 mx-auto h-[95%] w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
    >
      <div>
        <Toaster position="bottom-center" />
        <button
          className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818]
          hover:bg-[#181818]"
          onClick={handleClose}
        >
          <XIcon className="h-6 w-6" />{' '}
        </button>

        <div className="relative pt-[56.25%]">
          {hasTrailer ? (
            <ReactPlayer
              playing
              muted={muted}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              url={`https://www.youtube.com/watch?v=${trailer}`}
            />
          ) : (
            <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-[#181818]">
              <h2>Não há trailers no momento.</h2>
            </div>
          )}

          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2">
              <button className="flex items-center gap-x-2 rounded bg-white px-6 text-xl font-bold text-black transition hover:bg-[#e6e6e6]">
                <FaPlay className="h-7 w-7 text-black" />
                Play
              </button>
              <button
                className="modalButton"
                onClick={handleAddOrRemoveFavorite}
              >
                {addedToList ? (
                  <CheckCircleIcon className="h-7 w-7" />
                ) : (
                  <PlusIcon className="h-7 w-7 text-white" />
                )}
              </button>
              <button className="modalButton" onClick={handleLikeMovie}>
                {like ? (
                  <HiThumbUp className="h-7 w-7 text-white" />
                ) : (
                  <HiOutlineThumbUp className="h-7 w-7 text-white" />
                )}
              </button>
            </div>
            <button className="modalButton" onClick={() => setMuted(!muted)}>
              {muted ? (
                <VolumeOffIcon className="h-7 w-7 text-white" />
              ) : (
                <VolumeUpIcon className="h-7 w-7 text-white" />
              )}
            </button>
          </div>
        </div>
        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
          <div className="space-y-6 text-lg">
            <h3 className="text-lg font-bold text-white">
              {movie?.title || movie?.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm">
              <p className="font-semibold text-green-400">
                {movie?.vote_average * 10}% Avaliação
              </p>
              <p className="font-light">
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div
                className="flex h-4 items-center justify-center rounded border border-white/40 
              px-1.5 text-xs"
              >
                HD
              </div>
            </div>
            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <p className="w-5/6">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span className="text-[gray]">Genêros: </span>
                  {genres.map((genre) => genre.name).join(', ')}
                </div>
                <div>
                  <span className="text-[gray]">Idioma original: </span>
                  {checkLanguage()}
                </div>

                <div>
                  <span className="text-[gray]">Avaliações: </span>
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MUIModal>
  );
};

export default Modal;
