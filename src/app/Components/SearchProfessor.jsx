'use client'
import React, {useEffect, useState} from 'react';

const headers = {
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.9",
    Authorization: "Basic dGVzdDp0ZXN0",
    Connection: "keep-alive",
    "Content-Type": "application/json",
    Origin: "https://www.ratemyprofessors.com",
    Referer: "https://www.ratemyprofessors.com/",
};

async function searchProfessors(profName, numOfResults) {
    const graphqlQuery = JSON.stringify({
        query: `
            query NewSearchTeachersQuery($query: TeacherSearchQuery!, $count: Int) {
                newSearch {
                    teachers(query: $query, first: $count) {
                        edges {
                            node {
                                id
                                legacyId
                                firstName
                                lastName
                                department
                                school {
                                    legacyId
                                    name
                                    id
                                }
                                avgRating
                                numRatings
                                wouldTakeAgainPercentRounded
                            }
                        }
                    }
                }
            }`,
        variables: {query: {text: profName}, count: numOfResults},
    });

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: graphqlQuery,
    };

    try {
        const response = await fetch(
            "https://www.ratemyprofessors.com/graphql",
            requestOptions
        );
        const data = await response.json();
        return data.data.newSearch.teachers.edges;
    } catch (error) {
        console.error("Error fetching professor data:", error);
        throw error;
    }
}

export default function SearchProfessor() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [dbProfessors, setDbProfessors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingProfessor, setEditingProfessor] = useState(null);

    useEffect(() => {
        fetchDbProfessors();
    }, []);

    const fetchDbProfessors = async () => {
        try {
            const response = await fetch('/api/professors');
            if (!response.ok) throw new Error('Failed to fetch professors');
            const data = await response.json();
            console.log(data)
            setDbProfessors(data);
        } catch (err) {
            console.error("Error fetching professors from database:", err);
            setError('Failed to fetch professors from database.');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const results = await searchProfessors(searchQuery, 5);
            setSearchResults(results);
        } catch (err) {
            setError('An error occurred while searching for professors. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToDatabase = async (professor) => {
        try {
            const response = await fetch('/api/professors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data: (professor)}),
            });
            if (!response.ok) throw new Error('Failed to add professor');
            alert('Professor added to database successfully!');
            fetchDbProfessors();
        } catch (err) {
            console.error("Error adding professor to database:", err);
            setError('Failed to add professor to database.');
        }
    };

    const handleEdit = (professor) => {
        setEditingProfessor(professor);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/professors', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingProfessor),
            });
            if (!response.ok) throw new Error('Failed to update professor');
            alert('Professor information updated successfully!');
            setEditingProfessor(null);
            fetchDbProfessors();
        } catch (err) {
            console.error("Error updating professor information:", err);
            setError('Failed to update professor information.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Professor Search and Management</h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter professor name"
                    className="border p-2 mr-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Search Results:</h2>
                    <ul>
                        {searchResults.map((result) => (
                            <li key={result.node.id}
                                className="mb-2 p-2 border rounded flex justify-between items-center">
                                <div>
                                    <p><strong>{result.node.firstName} {result.node.lastName}</strong></p>
                                    <p>Department: {result.node.department}</p>
                                    <p>School: {result.node.school.name}</p>
                                    <p>Average Rating: {result.node.avgRating}</p>
                                    <p>Number of Ratings: {result.node.numRatings}</p>
                                </div>
                                <button
                                    onClick={() => handleAddToDatabase(result.node)}
                                    className="bg-green-500 text-white p-2 rounded"
                                >
                                    Add to Database
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Database Professors */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Professors in Database:</h2>
                <ul>
                    {dbProfessors.map((professor, index) => (
                        <li key={index} className="mb-2 p-2 border rounded">
                            <p><strong>{professor.metadata.firstName} {professor.lastName}</strong></p>
                            <p>Department: {professor.metadata.department}</p>
                            <p>School: {professor.metadata["school.name"]}</p>
                            <p>Average Rating: {professor.metadata.avgRating}</p>
                            <p>Number of Ratings: {professor.metadata.numRatings}</p>
                            <button
                                onClick={() => handleEdit(professor)}
                                className="bg-yellow-500 text-white p-2 rounded mt-2"
                            >
                                Edit
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Edit Professor Form */}
            {editingProfessor && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">Edit Professor Information</h2>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            value={editingProfessor.metadata.firstName}
                            onChange={(e) => setEditingProfessor({
                                ...editingProfessor, metadata: {
                                    firstName: e.target.value
                                }
                            })}
                            placeholder="First Name"
                            className="border p-2 mr-2 mb-2"
                        />
                        <input
                            type="text"
                            value={editingProfessor.metadata.lastName}
                            onChange={(e) => setEditingProfessor({
                                ...editingProfessor,
                                metadata: {
                                    lastName: e.target.value
                                }
                            })}
                            placeholder="Last Name"
                            className="border p-2 mr-2 mb-2"
                        />
                        <input
                            type="text"
                            value={editingProfessor.metadata.department}
                            onChange={e => setEditingProfessor({
                                ...editingProfessor,
                                metadata: {
                                    department: e.target.value
                                }
                            })}
                            placeholder="Department"
                            className="border p-2 mr-2 mb-2"
                        />
                        <input
                            type="number"
                            value={editingProfessor.metadata.avgRating}
                            onChange={(e) => setEditingProfessor({
                                ...editingProfessor,
                                metadata: {
                                    avgRating: parseFloat(e.target.value)
                                }
                            })}
                            placeholder="Average Rating"
                            className="border p-2 mr-2 mb-2"
                        />
                        <input
                            type="number"
                            value={editingProfessor.metadata.numRatings}
                            onChange={(e) => setEditingProfessor({
                                ...editingProfessor,
                                metadata: {
                                    numRatings: parseInt(e.target.value)
                                }
                            })}
                            placeholder="Number of Ratings"
                            className="border p-2 mr-2 mb-2"
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                            Update Professor
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}