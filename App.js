import React, { useEffect, useState } from 'react';
import { StyleSheet, View,SafeAreaView, Text,Image, Alert, TextInput, Button,Modal, TouchableOpacity, Dimensions, FlatList, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';



export default function App() {
  const [events, setEvents] = useState([])
  const [finished, setFinished] = useState([{id: "1234"}])
  const [secondCount, setSecond] = useState(0)
  const [day, setDay] = useState(0)
  const [run, setRun] = useState(true)
  const [count, setCount] = useState(0)
  const [text, setText] = useState("");
  const [notes, setNotes] = useState("");
  const [inputText, setInputText] = useState(""); 
  const [modalTrue, setModal] = useState(false)
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date (Date.now() + 3600*25*40));
  const [mode, setMode] = useState('time');
  const [displayType, setDisplay] = useState('default');
  const [numOfDays, setNum] = useState(1)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("null");
  const [newDate, setNewDate] = useState(null);
  const [items, setItems] = useState([
    {label: 'Tomorrow', value: 'tomorrow'},
    {label: '3 Days', value: 'three'},
    {label: 'Next Week', value: 'nextweek'},
    {label: 'Two Weeks', value: 'twoweeks'}
  ]);
  const [completed, setComp] = useState([])

  const addEventsToCalendar = async () => {
    const event = {
      title: text,
      notes: notes,
      startDate: dateStart,
      endDate: dateEnd,
      //timeZone: Localization.timezone
    };
    const defaultCal = await Calendar.getDefaultCalendarAsync()

    try {
      const createEventAsyncResNew = await Calendar.createEventAsync(
        defaultCal.id,
        event
      );
        setCount(count+1)
      return createEventAsyncResNew;
    } catch (error) {
      console.log(error);
    }
  };
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@storage_Key', JSON.stringify(value))
    } catch (e) {
      // saving error
    }
  }
  
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if(value !== null) {
        setComp(JSON.parse(value))
      }
    } catch(e) {
      // error reading value
    }
  }


  const removeData = async (value) => {
    try {
      await AsyncStorage.setItem('@storage_Key', JSON.stringify(value))
    } catch(e) {
      // remove error
    }
  
    console.log('Done.')
  }
  
  const updateEvent = async () => {
    const event = {
      title: editTitle,
      notes: editNotes == null ? "" : editNotes,
      startDate: editStart,
      endDate: editEnd,
      //timeZone: Localization.timezone
    };
    
    const defaultCal = await Calendar.getDefaultCalendarAsync()

    try {
      const createEventAsyncResNew = await Calendar.updateEventAsync(
        events[editIndex].id,
        event
      );
      
      return createEventAsyncResNew;
    } catch (error) {
      console.log(error);
    }
  };

  function reset () {
    setText("")
    setNotes("")
    setDateStart(new Date())
    setDateEnd(new Date (Date.now() + 3600*25*40))

  }
  const deleteEventsToCalendar = async () => {
    const defaultCal = await Calendar.getDefaultCalendarAsync()
    const calendars = await Calendar.getEventsAsync([defaultCal.id],new Date(new Date().setDate(new Date().getDate()-1)), new Date(new Date().setDate(new Date().getDate()+numOfDays)));

    try {
      const createEventAsyncResNew = await Calendar.deleteEventAsync(
        events[editIndex].id,
      );
        
      return createEventAsyncResNew;
    } catch (error) {
      console.log(error);
    }
  };

function checking() {
  for(let i = 0; i < events.length; i++){
    if(events[i].id == completed[i].id){
      console.log("hleoo")
      setEvents([...events.slice(0, i),...events.slice(i + 1)])
    }
    
  }
}

function isInThePast(array) {
  const today = new Date();

  for (let i = 0; i<array.length; i++){
    if(completed.includes(array[i]) == false && new Date(array[i].endDate) < today ){
      setEvents([...array.slice(0, i),...array.slice(i + 1)])
      setComp([...completed, array[i]])
      storeData([...completed,array[i]]);
    }
    else{
      console.log("it doesnt")
    }
  }

}


  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const defaultCal = await Calendar.getDefaultCalendarAsync()
        const calendars = await Calendar.getEventsAsync([defaultCal.id],new Date(new Date().setDate(new Date().getDate())), value == "null" ? new Date(new Date().setDate(new Date().getDate()+2)): value == "tomorrow" ? new Date(new Date().setDate(new Date().getDate()+2)): value == "nextweek" ? new Date(new Date().setDate(new Date().getDate()+7)): value == "three" ? new Date(new Date().setDate(new Date().getDate()+3)) : value == "twoweeks" ? new Date(new Date().setDate(new Date().getDate()+14)) : new Date(new Date().setDate(new Date().getDate()+1)));
        setEvents(calendars)
        setSecond(secondCount+1)
        console.log('Here are all your calendars:');
        
      }
    })();
  }, [count,value]);
  
function dup() {
    for(let i = 0; i<events.length; i++){
      for(let k = 0; k<completed.length; k++){
        if(events[i].id == completed[k].id){
          setEvents([...events.slice(0, i),...events.slice(i + 1)])
        }
      }
    }
  }

  useEffect (() => {
    const interval = setInterval(() => {
      isInThePast(events)
    }, 5000);
    return () => clearInterval(interval);
    
  
  }, [secondCount, count])

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const defaultCal = await Calendar.getDefaultCalendarAsync()
        const calendars = await Calendar.getEventsAsync([defaultCal.id],new Date(new Date().setDate(new Date().getDate()-7)), new Date());
        setComp(calendars)
        getData()
      }
    })();
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDateStart(currentDate);
  };

  const onChangeTwo = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDateEnd(currentDate);
  };

  const editChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setEStart(currentDate);
  };

  const editChangeTwo = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setEEnd(currentDate);
  };


  function complete (i) {
    let tempOne = new Object(i)
    setComp([...completed, tempOne])
  }

  const [editIndex, setEIndex] = useState()
  const [editTitle, setETitle] = useState()
  const [editStart, setEStart] = useState()
  const [editEnd, setEEnd] = useState()
  const [editNotes, setENotes] = useState()
  const [editModal, setEModal] = useState(false)

  function testing(i) {
    setEIndex(i)
    setETitle(events[i].title)
    setEStart(events[i].startDate)
    setEEnd(events[i].endDate)
    setENotes(events[i].notes)
  }

  function saving(){
    events[editIndex].title = editTitle
    events[editIndex].startDate = editStart
    events[editIndex].endDate = editEnd
    events[editIndex].notes = editNotes
  }
  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#9067C6","#B52947"]}
        style={styles.background}
      />
      <SafeAreaView style = {styles.safeAreaStyle}>
     <View style = {{borderBottomWidth: 1, borderColor: "white", width: "100%", justifyContent: "center", alignItems: "flex-start"}}>
        <Text style = {{color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 5, marginLeft: "3%"}}>To-Do List</Text>
        </View>
      <DropDownPicker
      open={open}
      value={value}
      placeholder="Tomorrow"
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      theme="DARK"
      //style = {{width: "50%"}}
    />

      <TouchableOpacity style = {styles.plus} 
      onPress = {() => {setModal(true); reset()}}
      >
      <Image
        style = {{width: 35, height: 35, marginLeft: 15}}
        source={require('./assets/plus.png')}
        
        />
      </TouchableOpacity>
      <View style = {{flex: 0.05}}>

      </View>
      <View style = {styles.flatCont}>
      <Text style = {{fontWeight: "bold", marginLeft: 10, color: "white", fontSize: 18}}>All Tasks</Text>
      <FlatList
        data={events}
        renderItem={({ item, index }) => (
        <View
        style={styles.compflatListBox}
        
        
        >
        <View style = {{flex: 0.2, height: "90%", justifyContent: "center", alignItems: "flex-start"}}>
          <TouchableOpacity style = {{width: 35, height: 35, marginLeft: 18, borderRadius: 25, borderWidth: 3, borderColor: "#8D86C9"}}
          onPress = {() => { storeData([...completed,item]); setFinished([...finished, item]), console.log(isInThePast(new Date(item.endDate)));setEvents([...events.slice(0, index),...events.slice(index + 1)]); setComp([...completed, item]); }}

          >

          </TouchableOpacity>
          </View>
          <View style = {{flexDirection: "column", marginLeft: 25,  flex: 0.8, height: "90%", margin: 5, justifyContent: "center", alignItems: "flex-start"}}>
          <Text style = {{color: "white", fontSize: 16, fontWeight: "bold", color: "white"}}>{item.title}</Text>
          <Text style = {{color: "white",fontSize: 13, color: "white"}}>{moment(item.endDate).format('LL')}</Text>
          </View>

          <TouchableOpacity 
          onPress = {() => {testing(index); setEModal(true); console.log(events)}}

          style = {{flexDirection: "column",  flex: 0.2, height: "90%", margin: 5, justifyContent: "center", alignItems: "flex-start"}}>
          <Image
        style = {{width: 30, height: 30, marginLeft: 15}}
        source={require('./assets/edit.png')}
        
        />
          </TouchableOpacity>
        </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        />

      </View>
      <View style = {styles.flatContTwo}>
        <Text style = {{fontWeight: "bold", marginLeft: 10, color: "white", fontSize: 18}}>Completed</Text>
      <FlatList
        data={completed}
        renderItem={({ item, index }) => (
        <View 
        style={styles.compflatListBox}
        >
          <TouchableOpacity style = {{flex: 0.2, height: "90%", justifyContent: "center", alignItems: "flex-start"}}
          onPress = {() => {removeData([...completed.slice(0, index),...completed.slice(index + 1)]); setComp([...completed.slice(0, index),...completed.slice(index + 1)]); setEvents([...events, item]); }}>
          <Image
        style = {{width: 40, height: 40, marginLeft: 15}}
        source={require('./assets/check.png')}
        
        />
          </TouchableOpacity>
          <View style = {{flexDirection: "column", flex: 0.8, height: "90%", margin: 5, justifyContent: "center", alignItems: "flex-start"}}>
          <Text style = {{color: "white", fontSize: 16, fontWeight: "bold", textDecorationLine: 'line-through', color: "#D3D3D3"}}>{item.title}</Text>
          <Text style = {{color: "white",fontSize: 13,textDecorationLine: 'line-through', color: "#D3D3D3"}}>{moment(item.endDate).format('LL')}</Text>
          </View>
       
        </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        />

      </View>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalTrue}
        >
           <View style={styles.centeredView}>
            <View style={styles.runModal}>
            <TouchableOpacity
              style = {styles.closeButton} 
        
              onPress={() => {setModal(false)}}
              >
            <Text style = {{color: "white"}}>x</Text>
            </TouchableOpacity>
              <View style = {{marginTop: "5%", justifyContent: "flex-start", width: "100%", borderBottomColor: "white", borderBottomWidth: 1}}>
            <TextInput 
              style={styles.inputbox} 
              value = {text} 
              placeholder = "Add Title" 
              placeholderTextColor="white" 
              keyboardType = "default" 
              onChangeText={(value) => {setText(value)}} 
              clearTextOnFocus/>
              </View>


            <View style = {{flexDirection: "row", marginTop: "5%"}}>

        <View style = {{marginTop: "5%",justifyContent: "center",  width: "100%", height: "40%"}}>
            <DateTimePicker
                testID="dateTimePicker"
                value={dateStart}
                mode={"datetime"}
                textColor="white"
                is24Hour={true}
                themeVariant="dark"
                display= {displayType}
                onChange={onChange}
                //style = {{marginRight: "70%", margin: 2,  backgroundColor: "#242038",}}
        />
        </View>

            </View>
          
            <View style = {{flexDirection: "row", marginTop: "-15%"}}>
              
        <View style = {{justifyContent: "center",  width: "100%", height: "40%"}}>
            <DateTimePicker
                testID="dateTimePicker"
                value={dateEnd}
                mode={"datetime"}
                textColor="white"
                is24Hour={true}
                themeVariant="dark"
                display= {displayType}
                onChange={onChangeTwo}
                //style = {{marginRight: "70%", margin: 2,  backgroundColor: "#242038",}}
        />
        </View>

            </View>



      

      
        <View style = {{justifyContent: "flex-start", width: "100%", marginTop: "-10%", borderBottomColor: "white", borderBottomWidth: 1}}>
              
              <TextInput 
        style={styles.inputbox} 
        value = {notes} 
        placeholder = "Add Notes" 
        placeholderTextColor="white" 
        keyboardType = "default" 
        onChangeText={(value) => {setNotes(value)}} 
        clearTextOnFocus/>
        </View>
     
          <TouchableOpacity
          style = {{width: "50%", borderRadius: 25, borderWidth: 1, borderColor: "white", height: "10%", marginTop: "5%", justifyContent: "center", alignItems: "center"}}
          onPress = {() => {text != "" ? [addEventsToCalendar(), setModal(false)] : Alert.alert("Please enter a title")}}
          >
            <Text style = {{color: "white", fontWeight: "bold"}}>ADD</Text>
          </TouchableOpacity>

            </View>
          </View>
        </Modal>





        <Modal
          animationType="slide"
          transparent={true}
          visible={editModal}
        >
           <View style={styles.centeredView}>
            <View style={styles.runModal}>
            <TouchableOpacity
              style = {styles.closeButton} 
        
              onPress={() => {setEModal(false)}}
              >
            <Text style = {{color: "white"}}>x</Text>
            </TouchableOpacity>
            <View style = {{marginTop: "5%", justifyContent: "flex-start", width: "100%", borderBottomColor: "white", borderBottomWidth: 1}}>
            <TextInput 
              style={styles.inputbox} 
              value = {editTitle} 
              placeholder = {editTitle}
              placeholderTextColor="white" 
              keyboardType = "default" 
              onChangeText={(value) => {setETitle(value)}} 
              />
              </View>
              <View style = {{flexDirection: "row", marginTop: "5%"}}>

        <View style = {{justifyContent: "center",  width: "100%", height: "40%"}}>
            <DateTimePicker
                testID="dateTimePicker"
                value= {new Date(editStart)}
                mode={"datetime"}
                textColor="white"
                is24Hour={true}
                themeVariant="dark"
                display= {displayType}
                onChange={editChange}
                //style = {{marginRight: "70%", margin: 2,  backgroundColor: "#242038",}}
        />
        </View>

            </View>
          
            <View style = {{flexDirection: "row", marginTop: "-15%"}}>
              
        <View style = {{justifyContent: "center",  width: "100%", height: "40%"}}>
            <DateTimePicker
                testID="dateTimePicker"
                value={new Date (editEnd)}
                mode={"datetime"}
                textColor="white"
                is24Hour={true}
                themeVariant="dark"
                display= {displayType}
                onChange={editChangeTwo}
                //style = {{marginRight: "70%", margin: 2,  backgroundColor: "#242038",}}
        />
        </View>

            </View>



      

      
        <View style = {{justifyContent: "flex-start", width: "100%", marginTop: "-10%", borderBottomColor: "white", borderBottomWidth: 1}}>
              
              <TextInput 
        style={styles.inputbox} 
        value = {editNotes} 
        placeholder = {editNotes == null ? "Add Notes": editNotes}
        placeholderTextColor="white" 
        keyboardType = "default" 
        onChangeText={(value) => {setNotes(value)}} />
        </View>
     
          <View style = {{flex: 1, width: "100%", flexDirection: "row", justifyContent: "space-between",}}>

       
          <TouchableOpacity
          style = {{width: "40%", borderRadius: 25, borderWidth: 1, borderColor: "green", height: "20%", marginTop: "10%", justifyContent: "center", alignItems: "center"}}
          onPress = {() => {saving(); updateEvent(); setEModal(false)}}
          >
            <Text style = {{color: "white", fontWeight: "bold"}}>SAVE</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style = {{width: "40%", borderRadius: 25, borderWidth: 1, borderColor: "red", height: "20%", marginTop: "10%", justifyContent: "center", alignItems: "center"}}
          onPress = {() => {deleteEventsToCalendar(); setEvents([...events.slice(0, editIndex),...events.slice(editIndex + 1)]); setEModal(false) }}
          >
            <Text style = {{color: "white", fontWeight: "bold"}}>DELETE</Text>
          </TouchableOpacity>
            
          </View>
          </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8D86C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatCont: {
    flex: 0.5,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  flatContTwo: {
    flex: 0.5,
    //backgroundColor:"blue",
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start"

  },
  flatListBox: {
    backgroundColor: "#242038",
    borderRadius: 25,
    borderColor: "#F7ECE1",
    borderWidth: 1,
    flexDirection: "coloumn",
    width: windowWidth,
    height: 60,
    //opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: 5,
    marginTop: 10
  },
  compflatListBox: {
    backgroundColor: "#242038",
    borderRadius: 25,
    borderColor: "#F7ECE1",
    borderWidth: 1,
    flexDirection: "row",
    width: windowWidth,
    height: 60,
    //opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: 5,
    marginTop: 10
  },
  plus: {
    //backgroundColor: "black",
    width: "10%",
    height: "5%",
    //marginLeft: "80%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "99.5%",
    left: "85%"
  },
  safeAreaStyle: {
    flex: 1,
    alignItems: 'center',
    //backgroundColor: "#9067C6",
    justifyContent: 'center',
    width: "100%",
  },
  runModal: {
    //marginTop: "30%",
    backgroundColor: "#242038",
    height: "50%",
    width: "90%",
    margin: 20,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2,
    opacity: 0.8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 22
  },
  inputbox: {
    width: windowWidth,
    height: 36,
    fontSize: 16,
    fontWeight: "bold",
    borderColor: "#09BC8A",
    //borderWidth: 1,
    textAlign: "left",
    color: "white"
  },
  setAlarmCont:{
    flex: 0.1,
    //backgroundColor: "black",
    width: "100%",
    //alignItems: "flex-start",
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: windowHeight ,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: "white",
    height: 27,
    width: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27/2,
    alignSelf: "flex-end",
    position: "absolute",
    left: "104%",
    bottom: "103%"  
  },


});
