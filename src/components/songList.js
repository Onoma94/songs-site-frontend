import React, { useState, useEffect } from "react";
import SongsService from "../services/songsService";
import Pagination from "../components/pagination";
import SongFrame from "../components/songFrame";

const SongList = () => {

    const [songs, setSongs] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [songsPerPage, setSongsPerPage] = useState(50);
    
    const plCollator = new Intl.Collator('pl');

    useEffect(() => {
        retrieveSongs();
      }, []);

    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

    const onChangeSearchTitle = e =>
    {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const retrieveSongs = () =>
    {
        SongsService.getAllSongs()
          .then(response => {
            setSongs((response.data).sort(function(a, b) {return plCollator.compare(a.artistname, b.artistname) }));
          })
          .catch(e => {
            console.log(e);
          });
        setCurrentPage(1);
    };

    const findByTitle = () =>
    {
        SongsService.findByTitle(searchTitle)
          .then(response => {
            setSongs(response.data.sort(function(a, b) {return plCollator.compare(a.artistname, b.artistname) }));
          })
          .catch(e => {
            console.log(e);
        });
        setCurrentPage(1);
    };

    const paginate = pageNumber => setCurrentPage(pageNumber);
    
    return(
        <div className="container">
            <input
                type="text"
                className="search-form"
                placeholder="Search by title"
                value={searchTitle}
                onChange={onChangeSearchTitle}
            />
            <div className="input-group-append">
                <button
                    className="search-btn"
                    type="button"
                    onClick={findByTitle}
                >
                Search
                </button>
            </div>
            <p>Select a song or use search!</p>
            <div className="songs-container">
                <h4>All Songs</h4>
                    {
                        currentSongs && currentSongs.map(song =>
                            (
                                <SongFrame song={song} />
                            )
                        )
                    }
                <Pagination itemsPerPage={songsPerPage} totalItems={songs.length} paginate={paginate} />
            </div>
        </div>
    )
}



export default SongList;