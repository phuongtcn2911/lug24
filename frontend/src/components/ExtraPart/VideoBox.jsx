import { VideoURL,getVideoID } from "../../data/Data"


export default function VideoBox() {

    var playlistID=getVideoID(VideoURL);
    var src=`${VideoURL}?autoplay=1&mute=1&loop=1&playlist=${playlistID}`;

    return (
        <div style={{ width: "100%", maxWidth: "100%"}}>
            <figure className="image is-16by9">
                <iframe
                    className="has-ratio"
                    src={src}
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                ></iframe>
            </figure>
        </div>
    )
}