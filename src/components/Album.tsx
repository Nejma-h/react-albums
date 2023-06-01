import React, { useState, useEffect } from 'react';

// Define album object structure
interface IAlbum {
    name: string;
    artists: Array<{ name: string }>;
    album: {
        name: string;
        genre: string;
        images: [
            {
                url: string,
                height: 300,
                width: 300,
            }
        ],
    }

}

// Define Spotify component
const SpotifyTopAlbums = () => {
    const [albums, setAlbums] = useState<IAlbum[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Authorization token
    const token = 'BQA-uuG8zlD4Q1qgQox8pwtTchVGverHZxJBbO8f1yCdNFVhuzn-MEpx-TGC89BMXGgMfKsaGdBPISWB-r6vB2SrkYjQThXszvDKfYydkb8XiIf2CYyWrT6PWvyzj2QeQy3C-yPQxUm-6eONBw2kLhUo-Orr5dRe_aW5kte_dKZu2TedT1-aLQnkdyMjoHW6CetkpUekyAmmQc-JSLO5vykgqfaHNd2Bm_Vz-NT67QtPAZdmDjKjc7N2lLhZ1eUDnsMr';

    async function fetchWebApi(endpoint: string, method: string, body?: any) {
        const res = await fetch(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method,
            body: JSON.stringify(body),
        });
        return await res.json();
    }

    async function getTopTracks() {
        return (await fetchWebApi(
            'v1/me/top/tracks?time_range=short_term&limit=20', 'GET'
        )).items;
    }

    useEffect(() => {
        getTopTracks()
            .then(setAlbums)
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });
    }, []);

    // handle error
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className="row">
                {albums.map((album: IAlbum, index: number) => (
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card">
                            <img className="card-img-top" src={album.album.images[0].url} alt={album.name} />
                            <div className="card-body">
                                <h5 className="card-title">{album.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{album.album.name}</h6>
                                <p className="card-text"><strong>Genre:</strong> {album.album.genre}</p>
                                <div><i className="fa-solid fa-microphone"></i><p className="card-text">{album.artists.map(artist => artist.name).join(', ')}</p></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default SpotifyTopAlbums;
