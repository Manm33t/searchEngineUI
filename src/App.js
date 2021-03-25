import React, {Component} from 'react';
import styles from './style.css';

import AsyncSelect from 'react-select/async';


class App extends Component {
  state = {
    searchText: undefined,
    searchData: [],
    selectedData: [],
    item: {},
    showDropDown: false
  };

  getShortName = (name = '', length = 6) => {
    let str = name;
    if (name.length > length) {
      str = name.substr(0, length) + '...';
    }
    return str
  }
  handleSearch = (search, callback) => {
    console.log(search);
    // const {value} = search.target;
    const {searchData} = this.state;
    const updatedSearchData = searchData;
    updatedSearchData.push({name: search});
    console.log(search);
    this.setState({searchText: search, searchData: updatedSearchData}, () => {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({searchText: search})
      };
      fetch('http://localhost:7000/search', requestOptions).then(res => res.json()).then(json => {

        this.setState({searchData: json.data, showDropDown: json.data.length});
        callback(json.data.map(i => ({label: i.Title, value: i.ID})))
      })

    })
  };
  handleSearchClick = (a) => {
    this.setState({item: {}});
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: a.ID})
    };
    fetch('http://localhost:7000/getDataById', requestOptions).then(res => res.json()).then(json => {
      console.log(json);
      this.setState({searchData: [], showDropDown: false, searchText: undefined, item: {...json.data[0]}})
    })
  };

  handleChange = (selectedUsers = []) => {
    console.log(selectedUsers);
    const updatedSelectedUsers = selectedUsers.map(a => ({label: this.getShortName(a.label,10), value: a.value}));
    console.log(updatedSelectedUsers, 'updated')
    this.setState({selectedData: updatedSelectedUsers || []});
  };


  render() {
    const {searchText, selectedData, searchData, item: {Title, Sponsor}, showDropDown} = this.state;
    console.log(selectedData, searchData, 'styles');
    return (
      <React.Fragment>
        <div>
          <h1 className="header">Custom Search Engine</h1>
          <div className="mainDiv">
            <AsyncSelect className="AsyncSelect"
                         isMulti
                         value={selectedData}
                         onChange={this.handleChange}
                         loadOptions={this.handleSearch}
                         placeHolder='type something...'
                         closeMenuOnSelect={false}
            />
          </div>
          {/*<div className="list" style={{display: `${showDropDown ? 'initial' : 'none'}`}}>*/}
          {/*  {searchData.map(a => {*/}
          {/*    return (*/}
          {/*      <ul*/}
          {/*        style={{color: a.highlight ? 'lightblue' : 'white'}}*/}
          {/*        onClick={() => this.handleSearchClick(a)}*/}
          {/*      >*/}
          {/*        {a.Title}*/}
          {/*      </ul>*/}
          {/*    )*/}
          {/*  })}*/}

          {/*</div>*/}
          {/*{Title ?*/}
          {/*  <div className="title">*/}
          {/*    <div>*/}
          {/*      <span id='1'>*/}
          {/*        Sponsor*/}
          {/*      </span>*/}
          {/*      <span id='2'>*/}
          {/*       : {Sponsor}*/}
          {/*      </span>*/}

          {/*    </div>*/}
          {/*    <div>*/}
          {/*      <span id='1'>*/}
          {/*        Title*/}
          {/*      </span>*/}
          {/*      <span id='2'>*/}
          {/*      : {Title}*/}
          {/*      </span>*/}

          {/*    </div>*/}
          {/*  </div> : null}*/}

        </div>

      </React.Fragment>


    )
      ;
  }
}

export default App;
