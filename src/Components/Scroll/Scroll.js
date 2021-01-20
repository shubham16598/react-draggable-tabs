import React, { useState, useEffect, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Scroll.css';
export default function Scroll() {

    const [tab, setTab] = useState([]);
    const [selectedTab, setSelectedTab] = useState(1);
    const [showAlert, setShowAlert] = useState(false);

    const myRef = useRef(null)
    const executeScroll = () => myRef.current.scrollIntoView()

    function setInitialData() {
        setTab(tab => [...tab, { id: 1 }, { id: 2 }, { id: 3 }]);
    }
    function reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;

    };

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            tab,
            result.source.index,
            result.destination.index
        );
        setTab(items);
    };

    function addTab() {
        let len = tab.length;
        if (len < 10) {
            let max = 0;
            tab.map(e => {
                if (e.id > max) {
                    max = e.id
                }
                return e.id;
            })
            setTab(tab => [...tab, { id: max + 1 }])
        }
    }


    function deleteTab(id) {
        let len = tab.length;
        let selected = selectedTab;
        if (len > 1) {
            let newArray = tab.map(e => {
                return e.id;
            })
            let a = newArray.indexOf(id);
            if (tab[a + 1]) {
                selected = tab[a + 1].id;
            } else {
                selected = tab[a - 1].id;
            }
        }
        let newArray = [];
        if (len > 1) {
            newArray = tab.filter(e => {
                return e.id !== id;
            })
            setTab(newArray);
            setSelectedTab(selected);
            setShowAlert(true);
        }
    }

    function onLeftChevron() {
        let len = tab.length;
        let selected = selectedTab;
        if (len > 1) {
            let newArray = tab.map(e => {
                return e.id;
            })
            let a = newArray.indexOf(selectedTab);
            if (tab[a + 1]) {
                selected = tab[a + 1].id;
            }
            setSelectedTab(selected, executeScroll());

        }
    }

    function onRightChevron() {
        let len = tab.length;
        let selected = selectedTab;
        if (len > 1) {
            let newArray = tab.map(e => {
                return e.id;
            })
            let a = newArray.indexOf(selectedTab);
            if (tab[a - 1]) {
                selected = tab[a - 1].id;
            }
            setSelectedTab(selected, executeScroll());
        }
    }
    function onPopUp(){
      setShowAlert(false);
    }

    useEffect(setInitialData, []);

    return (
        <div>
            <div className="scrolltab">
                <button onClick={onRightChevron} className="left-chevron"><h2> </h2></button>
                <div className="tabs">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable" direction="horizontal">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        display: "flex",
                                        height: "100%"
                                    }}
                                >
                                    {tab.map((e, index) =>
                                        (
                                            <Draggable key={e.id} draggableId={e.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <span id="{e.id}" ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps} onClick={() => setSelectedTab(e.id)} className={"tab " + (e.id === selectedTab ? "selected" : "")}>{(e.id !== selectedTab) && <div onClick={() => deleteTab(e.id)} className="icon">
                                                            &#x2715;
  </div>}<div ref={(e.id === selectedTab) ? myRef : undefined} className="tabText">{e.id}</div></span>)}
                                            </Draggable>
                                        ))}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <button onClick={onLeftChevron} className="right-chevron"><h2> </h2></button>
                <button onClick={addTab} className="add-tab"><h2>+</h2></button>
            </div>
            {showAlert && <div className='popup'>
                <div className='popup_inner'>
                    <h1>"Deleted"</h1>
                    <button onClick={onPopUp}>OK</button>
                </div>
            </div>}
        </div>
    )
}