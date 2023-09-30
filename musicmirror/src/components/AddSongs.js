import '../styles/AddSongs.css';

function AddSongs() {
  return (
    // add path to form-handler inside action attribute
    <form className="container p-4 col" action="">
      <div className="">
        <label className="form-label" for="fileInput">
          <h3 className="mb-2">Click to upload files:</h3>
          <img className="p-2" src="./images/upload.png" alt="upload area" />
          <input className="upload" type="file" id="fileInput" name="fileInput" accept="audio/*" multiple />
        </label>
      </div>
      <div className="">
        <label className="form-label" for="textInput">
          <h3 className="mt-5 mb-0">Or enter new songs here:</h3>
        </label>
        <textarea className="form-control" id="textInput" rows="5" placeholder="Type each song on its own line."></textarea>
      </div>
      <button className="mt-5 btn btn-secondary" type="submit">Update Playlist</button>
    </form>
  );
}

export default AddSongs;