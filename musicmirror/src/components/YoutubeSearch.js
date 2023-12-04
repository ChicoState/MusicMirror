import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {Tabs, Tab} from "react-bootstrap";
function YoutubeSearch({searchTearm, API_KEY,MAXRESULTS, accessToken}){
    const[singleSearch, setSingleSearch] = useState(Boolean);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [playlist, setPlaylists] = useState({ title: "Playlists Title", songs: [] });



    useEffect(()=>{
        if(searchTearm){
            const terms = searchTearm.split(",").map(term => term.trim());
            if(terms.length == 1){
                setSingleSearch(true);
                console.log("Doing a single search");
                searchYoutubeVideos(searchTearm);
            }
            else if(terms.length > 1 ){
                setSingleSearch(false);
                console.log('Doing a multi search');
                performMultiSearch(terms);
            }
            
        }else{
            console.log("Incorrect input");
        }
    },[searchTearm]);
    const handleVideoSelect = (videoId) => {
        setSelectedVideoId(videoId);
    };

    /*const performMultiSearch = async(searchTerms)=>{
        let newResults = {};
        for(const term of searchTerms){
            console.log("Inside multi", term);
            try{
                const response = await axios.get('https://www.googleapis.com/youtube/v3/search',{
                    params:{
                        part:'snippet',
                        maxResults: 5,
                        key: API_KEY,
                        q: term,
                        type: 'video',
                        videoCategoryId: '10'
                    }
                });
                newResults[term] = response.data.items;
            }catch (error){
                console.log("Failed to do multi search. ::REASON::", error);
            }
        }
        setSearchResults(newResults);
    };*/
    const performMultiSearch = async (searchTerms) => {
        let newResults = {};
        let newSongs = [];

        for (const term of searchTerms) {
            try {
                const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        maxResults: MAXRESULTS,
                        key: API_KEY,
                        q: term,
                        type: 'video',
                        videoCategoryId: '10',
                    },
                });

                const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');
                const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                    params: {
                        part: 'snippet,contentDetails',
                        id: videoIds,
                        key: API_KEY,
                    },
                });

                const detailedItems = searchResponse.data.items.map(item => {
                    const detail = detailsResponse.data.items.find(d => d.id === item.id.videoId) ?? {};
                    return {
                        ...item,
                        id: item.id,
                        title: item.snippet.title,
                        thumbnails: item.snippet.thumbnails,
                        duration: detail.contentDetails?.duration, // Use optional chaining in case contentDetails is undefined
                        // Add any other details you need here
                        channelTitle: item.snippet.channelTitle,
                        publishedAt: item.snippet.publishedAt,
                        // If there are additional details you want from the detail object, add them here
                        definition: detail.contentDetails?.definition,
                    };
                });

                newSongs.push({ query: term, tracks: detailedItems });
                newResults[term] = detailedItems;
            } catch (error) {
                console.error("Error in multi search for term:", term, "Error:", error);
            }
        }

        setSearchResults(newResults);
        setPlaylists({ ...playlist, songs: newSongs });
    };
    const renderSearchTermMenu = (term, videos) => {
        return (
          <div className="dropdown">
            <button className="dropbtn">{term}</button>
            <div className="dropdown-content">
              {videos.map((video, index) => (
                <a key={index} onClick={() => handleVideoSelect(video.id.videoId)}>
                  {video.snippet.title}
                </a>
              ))}
            </div>
          </div>
        );
      };
      const renderHamburgers = () => {
        return Object.entries(searchResults).map(([term, videos]) => {
          return (
            
            <div key={term}>
              {renderSearchTermMenu(term, videos)}
            </div>
          );
        });
      };


      const renderTabsWithThumbnails = () => {
        return (
          <Tabs defaultActiveKey={Object.keys(searchResults)[0]} id="search-results-tabs">
            {Object.entries(searchResults).map(([term, videos]) => (
              <Tab eventKey={term} title={term} key={term}>
                <div className="video-thumbnails">
                  {videos.map((video, index) => (
                    <div key={index} className="video-thumbnail" onClick={() => handleVideoSelect(video.id.videoId)}>
                      <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                      <p>{video.snippet.title}</p>
                    </div>
                  ))}
                </div>
              </Tab>
            ))}
          </Tabs>
        );
      };



    const searchYoutubeVideos = async (searchTearm) =>{
        try{
          const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params:{
              part: 'snippet',
              maxResults:MAXRESULTS,
              key: API_KEY,
              q: searchTearm,
              type: 'video',
              videoCategoryId: '10', 
              access_token: accessToken
            }
          });
          setSearchResults(response.data.items);
        }
        catch(error){
          console.error('Error During YOUTUBE API call', error);
        }
    };

    const renderPlayer = () => {
        return selectedVideoId && (
          <iframe
            width="auto"
            height="auto"
            src={`https://www.youtube.com/embed/${selectedVideoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen>
          </iframe>
        );
      };
      

    const renderSearchResults = () => {
        return Object.entries(searchResults).map(([term, videos]) => {
            console.log(`Results for ${term}:`, videos); // Debugging log
    
            // Ensure that videos is an array before mapping over it
            if (Array.isArray(videos)) {
                return (
                    
                    <div key={term}>
                        <h3>Result for "{term}":</h3>
                        {renderPlayer()}
                        {videos.map((video, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                            <div className="result" onClick={() => handleVideoSelect(video.id.videoId)}>
                                <img height="200" width="250" src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                                <h6>{video.snippet.title}</h6>
                            </div>
                            </div>
                            
                        ))}
                    </div>
                );
            }
            else {
                return <div key={term}>No results found for "{term}"</div>;
            }
        });
    };
    if(!singleSearch){
      return <div>
         {renderTabsWithThumbnails()}
        {selectedVideoId && renderPlayer()}
      </div>;
    }else{
        return (
    
            <div>
                {renderPlayer()} {/* This will render the video player if a video is selected */}
                {singleSearch ? (
                    searchResults.map((video, index) => (
                        <div key={video.id.videoId + index} style={{ marginBottom: '20px' }}>
                            <div className="result" onClick={() => handleVideoSelect(video.id.videoId)}>
                                <img height="200" width="250"
                                     src={video.snippet?.thumbnails?.medium?.url}
                                     alt={video.snippet.title} />
                                <h6>{video.snippet.title}</h6>
                            </div>
                        </div>
                    ))
                ) : (
                    renderSearchResults()
                )}
            </div>
        );
        
    }

}
export default YoutubeSearch;

