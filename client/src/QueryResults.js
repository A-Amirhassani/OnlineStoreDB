import React from 'react';
import Option1 from './QueryOptions/Option1';
import Option2 from './QueryOptions/Option2';
import Option3 from './QueryOptions/Option3';
import Option4 from './QueryOptions/Option4';
import Option5 from './QueryOptions/Option5';
import Option6 from './QueryOptions/Option6';
import Option7 from './QueryOptions/Option7';
import Option8 from './QueryOptions/Option8';
import Option9 from './QueryOptions/Option9';
import Option10 from './QueryOptions/Option10';
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
			<Option6 />
			<Option7 />
			<Option8 />
			<Option9 />
			<Option10 />
			{/* Render other options here */}
		</div>
	);
}

export default QueryResults;
