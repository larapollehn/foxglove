import React, {useState, useEffect} from "react";

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        results: [],
        searched: false
    });

    return(
        <div>
            <h4>Search bar</h4>
        </div>
    )
}

export default Search;
