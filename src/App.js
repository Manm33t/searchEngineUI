import React, {Component} from 'react';
import styles from './style.less';

class App extends Component {
  state = {
    searchText: undefined,
    searchData: [],
    item: {},
    showDropDown: false
  };
  handleSearch = (search) => {
    const {value} = search.target;
    const {searchData} = this.state;
    const updatedSearchData = searchData;
    updatedSearchData.push({name: value});
    console.log(value);
    this.setState({searchText: value, searchData: updatedSearchData}, () => {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({searchText: value})
      };
      fetch('http://localhost:7000/search', requestOptions).then(res => res.json()).then(json => {

        this.setState({searchData: json.data, showDropDown: json.data.length});
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

  render() {
    const {searchText, searchData, item: {Title, Sponsor}, showDropDown} = this.state;
    // console.log(styles, 'styles');
    return (
      <React.Fragment>
        <div>
          <h1 className={styles.header}>Custom Search Engine</h1>
          <div className={styles.mainDiv}>
            <input
              type='text'
              value={searchText}
              onChange={this.handleSearch}
              onBlur={this.handleSearch}
            />
          </div>
          <div className={styles.list} style={{display: `${showDropDown ? 'initial' : 'none'}`}}>
            {searchData.map(a => {
              return (
                <ul
                  style={{color: a.highlight ? 'lightblue' : 'white'}}
                  onClick={() => this.handleSearchClick(a)}
                >
                  {a.Title}
                </ul>
              )
            })}

          </div>
          {Title ?
            <div className={styles.title}>
              <div>
                <span id='1'>
                  Sponsor
                </span>
                <span id='2'>
                 : {Sponsor}
                </span>

              </div>
              <div>
                <span id='1'>
                  Title
                </span>
                <span id='2'>
                : {Title}
                </span>

              </div>
            </div> : null}

        </div>

      </React.Fragment>


    )
      ;
  }
}

export default App;
