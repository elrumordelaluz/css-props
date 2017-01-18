import React from 'react'
import 'isomorphic-fetch'

export default class MyPage extends React.Component {
  static async getInitialProps () {
    const res = await fetch('https://www.w3.org/Style/CSS/all-properties.en.json')
    const data = await res.json()
    return { data }
  }
  
  constructor (props) {
    super(props)
    this.state = { 
      filtered: this.props.data,
      status: {
        ed: true,
        fpwd: true,
        wd: true,
        lc: true,
        cr: true,
        pr: true,
        rec: true,
        note: true,
      }
    }
    
    this.filterData = this.filterData.bind(this)
    this.renderRows = this.renderRows.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.filterOnly = this.filterOnly.bind(this)
  }
  
  componentDidMount () {
    this.searchInput.focus()
  }
  
  renderRows () {
    const { filtered } = this.state
    return filtered.map((d, index) => {
      const { status, property, url, title } = d
      const altUrl = url.split('#')[0]
      const lcStatus = status.toLowerCase()
      const filterHandler = () => this.filterOnly(lcStatus)
      return (
        <div 
          className="item"
          key={`${property}-${index}`}
          style={{
            color: abbr[lcStatus],
          }}>
            <a className="property" href={url}>{ property }</a>
            <a className="title" href={altUrl}>{ title }</a>
            <span 
              onClick={filterHandler}
              className="status">{ status }</span>
          <style jsx>{`
            .item {
              position: relative;
              margin-bottom: 1em;
              background-color: #23272d;
              padding: .5em;
            }
              .item:before {
                content: '';
                position: absolute;
                width: .5em;
                height: .5em;
                border-radius: 100%;
                background-color: currentColor;
                left: -1.5em;
                border: .25em solid #373d45;
              }
            
            .property,
            .title,
            .status {
              text-decoration: none;
              font-weight: 100;
              line-height: 1.5;
              cursor: pointer;
            }
            
            .title,
            .status {
              font-size: .75em;
            }
            
            .property {
              display: block;
              color: #c5c5c5;
              font-size: 1em;
            }
              .property:hover {
                color: #e9f1f3;
              }
            
            
            .title {
              display: inline-block;
              color: #6c7278;
            }
              .title:hover {
                color: inherit;
                opacity: .6;
              }
            
            .status {
              position: absolute;
              right: .5em;
              top: 1em;
            }
              .status:hover {
                opacity: .7;
              }
          `}</style>
        </div>
      )
    })
  }
  
  toggleFilter (filter) {
    const filterData = () => this.filterData(this.searchInput.value)
    this.setState(prevState => ({
      status: {
        ...prevState.status,
        [filter]: !prevState.status[filter],
      }
    }), filterData)
  }
  
  filterOnly (filter) {
    const filterData = () => this.filterData(this.searchInput.value)
    this.setState(prevState => ({
      status: {
        ed: false,
        fpwd: false,
        wd: false,
        lc: false,
        cr: false,
        pr: false,
        rec: false,
        note: false,
        [filter]: true,
      }
    }), filterData)
  }
  
  filterData (value) {
    const { data } = this.props
    const { status } = this.state
    const regex = new RegExp(value, 'i')
    const filtered = data.filter(d => status[d.status.toLowerCase()])
                         .filter(d => regex.test(d.property))
    this.setState({ filtered })
  }

  render () {
    const { status } = this.state
    const searchHandler = e => this.filterData(e.target.value)
    return (
      <div className="wrapper">
        <header className="header">
          <h1 className="mainTitle">List of CSS properties</h1>
          <input
            className="search"
            type="text"
            ref={input => this.searchInput = input}
            onChange={searchHandler}
            placeholder="Search" />
          <div className="filters">
            { Object.keys(abbr).map(a => {
              const changeHandler = () => this.toggleFilter(a)
              const checked = status[a]
              return [
                <input 
                  id={a} 
                  type="checkbox" 
                  className="checkbox"
                  checked={checked}
                  onChange={changeHandler} />,
                <label 
                  htmlFor={a} 
                  style={{ color: abbr[a] }}
                  className="label">{ a }</label>
              ]
            }) }
          </div>
        </header>
        <main className="props">
          { this.renderRows() }
        </main>
        
        <style jsx>{`
          .wrapper {
            width: 50vw;
            margin: 1em auto;
          }
          .header {
            background-color: #D46e5c;
            color: white;
            padding: .7em 1em;
            position: fixed;
            top: 0;
            left: 50%;
            width: 50vw;
            transform: translateX(-50%);
            z-index: 100;
          }
          .mainTitle {
            font-weight: 100;
            text-transform: uppercase;
            font-size: 1.5em;
            margin: 0;
          }
          .search {
            border: 0;
            outline: 0;
            background: none;
            color: inherit;
            font-weight: 100;
            font-size: 1em;
            margin-top: .3em;
            width: 100%;
          }
          .search::-webkit-input-placeholder { 
            color: rgba(255,255,255,.3);
          }
          .search::-moz-placeholder { 
            color: rgba(255,255,255,.3);
          }
          
          .props {
            background-color: #373d45;
            padding: 6em 1em 1em 2em;
            position: relative;
          }
          .props:before {
            content: '';
            position: absolute;
            left: 1em;
            width: 1px;
            top: 0;
            bottom: 0;
            background-color: #59616a;
          }
          
          .filters {
            position: absolute;
            right: -1px;
            left: -1px;
            top: 100%;
            background-color: white;
            padding: .3em .5em;
            display: flex;
            justify-content: space-between;
            background-color: #23272d;
          }
          
          .label {
            text-transform: uppercase;
            opacity: .25;
            cursor: pointer;
            user-select: none;
            font-size: .7em;
          }
            .label:hover { opacity: .5 }
            .checkbox:checked + .label { opacity: 1 }
            .checkbox { display: none }
        `}</style>
      </div>  
    )
  }
}

const abbr = {
  ed: 'hsl(255,100%,100%)',
  fpwd: 'hsl(10,55%,55%)',
  wd: 'hsl(20, 78%, 55%)',
  lc: 'hsl(30, 68%, 65%)',
  cr: 'hsl(62, 86%, 45%)',
  pr: 'hsl(89, 53%, 44%)',
  rec: 'hsl(129, 53%, 40%)',
  note: 'hsl(129, 53%, 40%)',
}
