import React from 'react';
import * as youtube from './youtube'; // Assuming this is where your YouTube API functions are

class SongList extends React.Component {
    state = {
        playlists: [],
        selectedSong: null,
        showModal: false,
    };

    componentDidMount() {
        // Fetch playlists when the component mounts
        youtube.fetchUserPlaylists().then(playlists => {
            this.setState({ playlists });
        });
    }

    selectSong = (song) => {
        this.setState({ selectedSong: song, showModal: true });
    };

    addToPlaylist = (playlistId) => {
        const { selectedSong } = this.state;
        if (selectedSong) {
            youtube.addSongToPlaylist(playlistId, selectedSong.id)
                .then(() => {
                    console.log('Yuppy-something worked');
                    this.setState({ showModal: false });
                })
                .catch(error => {
                   console.log('Failed to add song',error);
                });
        }
    };

    renderPlaylistOptions() {
        const { playlists } = this.state;
        return playlists.map(playlist => (
            <button key={playlist.id} onClick={() => this.addToPlaylist(playlist.id)}>
                {playlist.title}
            </button>
        ));
    }

    render() {
        // Assuming songs is passed as a prop to this component
        const { songs } = this.props;
        const { showModal } = this.state;

        return (
            <div>
                {songs.map(song => (
                    <div key={song.id} onClick={() => this.selectSong(song)}>
                        {song.title}
                    </div>
                ))}

                {showModal && (
                    <div className="modal">
                        <h2>Select a Playlist</h2>
                        {this.renderPlaylistOptions()}
                        <button onClick={() => this.setState({ showModal: false })}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default SongList;
