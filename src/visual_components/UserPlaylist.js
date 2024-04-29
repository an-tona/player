//BOSS
import React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {useDropzone} from 'react-dropzone'
import { useState, useCallback, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { address, useFindPlaylistByIdQuery} from '../reducers/slices';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

const CoverImage = styled('div')({
    width: 100,
        height: 100,
        objectFit: 'cover',
        overflow: 'hidden',
        flexShrink: 0,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.08)',
        '& > img': {
            width: '100%',
        },
});



function Dropzone({onFile, children}) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        noDragEventsBubbling: true
    });

    useEffect(() => {
        for(let file of acceptedFiles) {
            if (file) {
                onFile(file)
            }
        }
    },[acceptedFiles])

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {children || <p>Перетягнить сюди файлік або клікніте щоб було круто</p>}
            </div>            
        </section>
    );
}


const uploadFile = (file, token) => {
    const formData = new FormData
    formData.append('track', file)
    return fetch('http://player.node.ed.asmer.org.ua/track',{
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + token
        },
        body: formData
    }).then(res => res.json())
}

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  borderRadius:'5px',

  // change background colour if dragging
  background: isDragging ? "rgb(255, 113, 205, 0.5)" : "",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "" : "",
  border: '1px solid rgb(57, 62, 70, 0.3)',
  borderRadius:'5px',
  padding: grid,
  width: '100%',
  minHeight: '50px'
});

const DND = ({onChange, items, render:Render}) => {
    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const newItems = reorder(
            items,
            result.source.index,
            result.destination.index
        );

        onChange(newItems)
    }
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction='vertical'>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {items.map((item, index) => (
                            <Draggable key={item._id} draggableId={item._id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            ),
                                            left: "auto !important",
                                            top: "auto !important"
                                        }}
                                    >
                                        <Render item={item}/>
                                        
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

const DropzoneWithUpload = ({onUpload, children}) => {
    const token = useSelector(state => state.auth.token)
    return (
        <Dropzone onFile={file => uploadFile(file, token).then(onUpload)}>
            {children}
        </Dropzone>
    )
}

// const DNDTrack = ({track}) => (
//     <div key={track?._id} className='track_item_drag' >
//                         <div className='track_item_container' style={{paddingLeft:'15px', display: 'flex'}}>
//                             <div className='track_name_container' style={{display: 'flex', gap:'15px'}}>
//                                 <div className='track_icon'>
//                                     <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width:'44px', height:'44px'}}>
//                                         <AudiotrackIcon style={{ fontSize: 24 }} />
//                                     </CoverImage>
//                                 </div>
//                                 <div className='track_name_artist'>
//                                     <Typography className='track_name'>
//                                         {track?.id3?.title || 'Untitled'}
//                                     </Typography>
//                                     <Typography className='track_artist' sx={{fontSize: 14}}>
//                                         {track?.id3?.artist || 'Unknown'}
//                                     </Typography>
//                                 </div>
//                             </div>
//                         </div>
//     </div>
// )

// export default function EditPlaylist({defaultPlaylist={_id:'', name:'', description:'', tracks:[]}, onSave, renderComp}) {
//     const [playlist, setPlaylist] = useState(defaultPlaylist)
//     useEffect(() => setPlaylist(defaultPlaylist), [JSON.stringify(defaultPlaylist)])

//     useEffect(() => {
//         onSave(playlist);
//     },[playlist])

//     return (
//         <div>
//             <DropzoneWithUpload onUpload={file => setPlaylist({...playlist, tracks: [...playlist.tracks, file]})}>
//                 <p style={{cursor:'pointer'}}>Upload your tracks</p>
//             </DropzoneWithUpload>
//             <DND items={playlist.tracks} onChange={tracks => setPlaylist({...playlist, tracks})} render={renderComp} />         
//         </div>
//     )
// }

export default function EditPlaylist({defaultTracks=[], onSave, renderComp}) {
    const [tracks, setTracks] = useState(defaultTracks);

    useEffect(() => {
        onSave(tracks);
    }, [tracks]);

    return (
        <div>
            <DropzoneWithUpload onUpload={file => setTracks(prevTracks => [...prevTracks, file])}>
                <p style={{cursor:'pointer'}}>Upload your tracks</p>
            </DropzoneWithUpload>
            <DND items={tracks} onChange={setTracks} render={renderComp} />         
        </div>
    );
}















// export default function UserPlaylist() {
    // const [playlist, setPlaylist] = useState({ _id: '', name: '', description: '', tracks: [] });

    // const handleSave = (playlistData) => {
    //     console.log(playlistData);
    // }

    // const handleSaveButtonClick = () => {
    //     handleSave(playlist);
    // };

//     return (
//         <>
//            <EditPlaylist defaultPlaylist={playlist} onSave={setPlaylist} renderComp={DNDTrack} />
//            <button onClick={handleSaveButtonClick}>Save</button>
//         </>
//     )
// }