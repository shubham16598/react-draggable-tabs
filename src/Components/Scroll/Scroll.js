import React, { useState, useEffect, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Scroll.css';
export default function Scroll() {

    const [tab, setTab] = useState([]);
    const [selectedTab, setSelectedTab] = useState(1);
    const [selectedTabTrack, setSelectedTabTrack] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const [showRightChevron, setShowRightChevron] = useState(true);
    const [showLeftChevron, setShowLeftChevron] = useState(true);

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
        setShowRightChevron(true);
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
        let newArray = [];
        if (len > 1) {
            newArray = tab.filter(e => {
                return e.id !== id;
            })
            setTab(newArray);
            setShowAlert(true);
        }
    }

    function onRightChevron() {
        setShowLeftChevron(true);
        let len = tab.length;
        let selected = selectedTab;
        if (len > 1) {
            let newArray = tab.map(e => {
                return e.id;
            })
            let a = newArray.indexOf(selectedTab);
            if (a === len - 2) {
                setShowRightChevron(false);
            }
            if (tab[a + 1]) {
                selected = tab[a + 1].id;
            }
            setSelectedTab(selected, executeScroll());

        }
    }

    function onLeftChevron() {
        setShowRightChevron(true);
        let len = tab.length;
        let selected = selectedTab;
        if (len > 1) {
            let newArray = tab.map(e => {
                return e.id;
            })
            let a = newArray.indexOf(selectedTab);
            if (a === 1) {
                setShowLeftChevron(false);
            }
            if (tab[a - 1]) {
                selected = tab[a - 1].id;
            }
            setSelectedTab(selected, executeScroll());
        }
    }
    function setTabClick(id) {
        setSelectedTabTrack(selectedTab);
        setSelectedTab(id);

    }
    function checkSeletedTabCheveron() {
        let len = tab.length;
        let newArray = tab.map(e => {
            return e.id;
        })
        let a = newArray.indexOf(selectedTab);
        if (a === 0) {
            setShowLeftChevron(false);
        } else {
            setShowLeftChevron(true);
        }
        if (a === --len) {
            setShowRightChevron(false);
        } else {
            setShowRightChevron(true);
        }
        if (a === -1) {
            setShowRightChevron(true) && setShowLeftChevron(true);;
        }
    }
    function onPopUp() {
        setShowAlert(false);
    }

    useEffect(setInitialData, []);
    useEffect(() => {
        let flag = true;
        tab.map(e => {
            if (e.id === selectedTab) {
                flag = false;
            }
            return e.id;
        })
        if (flag) {
            setSelectedTab(selectedTabTrack);
        }
        checkSeletedTabCheveron();
    }, [selectedTab]);

    return (
        <div>
            <div className="scrolltab">
                {showLeftChevron && <button onClick={onLeftChevron} className="left-chevron"><h2> </h2></button>}
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
                                                        {...provided.dragHandleProps} onClick={() => setTabClick(e.id)} className={"tab " + (e.id === selectedTab ? "selected" : "")}>{(e.id !== selectedTab) && <div onClick={() => deleteTab(e.id)} className="icon">
                                                            &#x2715;
  </div>}<div ref={(e.id === selectedTab) ? myRef : undefined} className="tabText">{e.id}</div></span>)}
                                            </Draggable>
                                        ))}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                {showRightChevron && <button onClick={onRightChevron} className="right-chevron"><h2> </h2></button>}
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