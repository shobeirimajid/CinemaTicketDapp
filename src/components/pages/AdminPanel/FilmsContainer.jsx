import React, { useState, useEffect, useCallback } from "react"


import ChangeFilmModal from "./modals/ChangeFilmModal";
import { FaInfoCircle,FaEdit,FaTrash } from 'react-icons/fa';

import SessionsModal from "./modals/SessionsModal";
import { getAllFilms, removeFilm } from "../../../sevices/Blockchain";
import Loader from "../../ui/Loader";

const FilmsContainer = ({ modal, cinemaContract }) => {
    const [loading, setLoading] = useState(true);
    const [changeAction, setChangeAction] = useState({
        film_id: null,
        film_name: null,
        film_poster: null,
        action: null
    });

    const [films, setFilms] = useState(null);

    const [viewFilmSessions, setViewFilmSessions] = useState({
        film_id: null,
        film_name: null,
        sessions: []
    });

    const fetchAll = useCallback(async (openModal = null, current_film = null) => {
        setLoading(true);

        const films_ = await getAllFilms(cinemaContract);

        setFilms(films_);

        if (openModal && current_film) {

            setViewFilmSessions({
                film_id: current_film,
                film_name: films_[current_film].name,
                sessions: films_[current_film].sessions
            });

            modal.open(openModal);
        }

        setLoading(false);

    }, [cinemaContract, setFilms, modal, setLoading])

    const remove = async (key) => {
        await removeFilm(key);

        await fetchAll();
    }

    useEffect(() => {
        if (cinemaContract)
            fetchAll();

        return setLoading(false);

    }, [cinemaContract, fetchAll]);

    return (
        <>
            {!loading ?
                <div className="" id="films">
                    <button  className="bg-red-500 py-2 px-4 rounded text-white mb-2" onClick={() => { setChangeAction({ action: 'create' }); modal.open('#modalFilmAction') }}>
                        Add new Film
                    </button>
                    
                    <table className="border-collapse w-full">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="py-2 px-4">#</th>
          <th className="py-2 px-4">Name of the film</th>
          <th className="py-2 px-4">Poster img</th>
          <th className="py-2 px-4">Sessions</th>
          <th className="py-2 px-4">Actions</th>
        </tr>
      </thead>

      <tbody>
        {films &&
          films.map((film, key) => (
            !film.includes("") && (
              <tr key={key} className="border-b border-gray-300">
                <td className="py-2 px-4">{key}</td>
                <td className="py-2 px-4">{film.name}</td>
                <td className="py-2 px-4">
                  <a href={film.poster_img} target="_blank" rel="noreferrer">
                    Watch
                  </a>
                </td>
                <td className="py-2 px-4">
                  {film.sessions.length}{' '}
                  <button className="text-blue-600" onClick={() => {
                    setViewFilmSessions({
                      film_id: key,
                      sessions: film.sessions,
                      film_name: film.name,
                    });
                    modal.open('#sessionPanel');
                  }}>
                    <FaInfoCircle />
                  </button>
                </td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600" onClick={() => {
                      setChangeAction({
                        action: 'update',
                        film_id: key,
                        film_name: film.name,
                        film_poster: film.poster_img,
                      });
                      modal.open('#modalFilmAction');
                    }}>
                      <FaEdit />
                    </button>
                    <button className="text-red-600" onClick={() => remove(key)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            )
          ))}
      </tbody>
    </table>

                    <ChangeFilmModal modal={modal} cinemaContract={cinemaContract} changeAction={changeAction} fetchFilms={fetchAll} />

                    <SessionsModal fetchFilms={fetchAll} modal={modal} cinemaContract={cinemaContract} data={viewFilmSessions} />
                </div>

                :
                <Loader />
            }

        </>

    );
};

export default FilmsContainer;