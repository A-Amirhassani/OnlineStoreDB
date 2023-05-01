import React from 'react';
import Option1 from './QueryOptions/Option1';
import Option2 from './QueryOptions/Option2';
import Option3 from './QueryOptions/Option3';
import Option4 from './QueryOptions/Option4';
import Option5 from './QueryOptions/Option5';
import './QueryResults.css';

// Import other options here

function QueryResults() {
	return (
		<div>
			<Option1 />
			<Option2 />
			<Option3 />
			<Option4 />
			<Option5 />
			{/* Render other options here */}
		</div>
	);
}

export default QueryResults;
