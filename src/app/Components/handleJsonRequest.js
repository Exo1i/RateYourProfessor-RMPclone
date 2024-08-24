import {getProfessorData, searchRPM} from "@/app/Components/searchRPM";
import {addProfessorToVD, queryData} from "@/app/Components/RAGstuff";
import departments from "../../../public/departments";

export default async function handleJsonRequest(jsonReq) {
    switch (jsonReq.operation) {
        case 'query': {
            switch (jsonReq.type) {
                case 'tutorSearch':
                    try {
                        const topDbResult = (await queryData(jsonReq.data)).matches[0];
                        if (topDbResult && topDbResult.metadata.name.toLowerCase().includes(jsonReq.data.toLowerCase())) {
                            return {
                                success: true,
                                responseMessage: `Found teacher: ${topDbResult.metadata.name} from ${topDbResult.metadata.school} in the ${topDbResult.metadata.department} department. Their average rating is ${topDbResult.metadata.avgRating} based on ${topDbResult.metadata.numRatings} ratings and difficulty of ${topDbResult.metadata.avgDifficulty}.`,
                                context: {
                                    operation: 'tutorSearch',
                                    searchTerm: jsonReq.data,
                                    resultType: 'existingTeacher',
                                    teacherDetails: topDbResult.metadata
                                }
                            };
                        }
                        const searchResults = await searchRPM({profName: jsonReq.data});
                        const parsedResults = JSON.parse(searchResults);

                        if (parsedResults.length === 0) {
                            return {
                                success: true,
                                responseMessage: "No teachers found matching your search.",
                                context: {
                                    operation: 'tutorSearch',
                                    searchTerm: jsonReq.data,
                                    resultType: 'noResults'
                                }
                            };
                        } else if (parsedResults.length === 1 || `${parsedResults[0].node.firstName.toLowerCase()} ${parsedResults[0].node.lastName.toLowerCase()}`.includes(jsonReq.data.toLowerCase())) {
                            const teacher = parsedResults[0].node;
                            addProfessorToVD(teacher.id);
                            return {
                                success: true,
                                responseMessage: `Found one teacher: ${teacher.firstName} ${teacher.lastName} from ${teacher.school.name} in the ${teacher.department} department. Their average rating is ${teacher.avgRating} based on ${teacher.numRatings} ratings.`,
                                context: {
                                    operation: 'tutorSearch',
                                    searchTerm: jsonReq.data,
                                    resultType: 'singleTeacher',
                                    teacherDetails: teacher
                                }
                            };
                        } else {
                            const teacherList = parsedResults.map(result => {
                                const t = result.node;
                                addProfessorToVD(t.id);
                                return `${t.firstName} ${t.lastName} (${t.school.name}, ${t.department})`;
                            });
                            return {
                                success: true,
                                responseMessage: `Found multiple teachers matching your search: ${teacherList.join(', ')}. Which one would you like more information about?`,
                                context: {
                                    operation: 'tutorSearch',
                                    searchTerm: jsonReq.data,
                                    resultType: 'multipleTeachers',
                                    teacherList: parsedResults.map(result => result.node)
                                }
                            };
                        }
                    } catch (error) {
                        console.error("Error in teacher search:", error);
                        return {
                            success: false,
                            responseMessage: "An error occurred while searching for teachers.",
                            context: {
                                operation: 'tutorSearch',
                                searchTerm: jsonReq.data,
                                resultType: 'error',
                                error: error.message
                            }
                        };
                    }
                case 'departmentSearch':
                    try {
                        if (departments[jsonReq.data.toString().toLowerCase()] === undefined) {
                            throw new Error("Department not found in the list.");
                        }

                        const results = await searchRPM({departmentID: departments[jsonReq.data.toString().toLowerCase()]});
                        const parsedResults = JSON.parse(results);
                        if (parsedResults.length === 0) {
                            return {
                                success: true,
                                responseMessage: "No teachers found in this department.",
                                context: {
                                    operation: 'departmentSearch',
                                    department: jsonReq.data,
                                    resultType: 'noResults'
                                }
                            };
                        } else {
                            const teacherList = parsedResults.slice(0, 5).map(result => {
                                const t = result.node;
                                addProfessorToVD(t.id);
                                return `${t.firstName} ${t.lastName} (Average rating: ${t.avgRating})`;
                            });
                            return {
                                success: true,
                                responseMessage: `Here are some teachers from the ${jsonReq.data} department: ${teacherList.join(', ')}. Would you like more information about any of them?`,
                                context: {
                                    operation: 'departmentSearch',
                                    department: jsonReq.data,
                                    resultType: 'success',
                                    teacherList: parsedResults.slice(0, 5).map(result => result.node)
                                }
                            };
                        }
                    } catch (error) {
                        console.error("Error in department search:", error);
                        return {
                            success: false,
                            responseMessage: "An error occurred while searching for teachers in this department.",
                            context: {
                                operation: 'departmentSearch',
                                department: jsonReq.data,
                                resultType: 'error',
                                error: error.message
                            }
                        };
                    }
                case 'recommendTutors':
                    try {
                        const results = await queryData(jsonReq.data);
                        if (results.matches.length === 0) {
                            return {
                                success: false,
                                responseMessage: "No similar tutors found.",
                                context: {
                                    operation: 'recommendTutors',
                                    searchTerm: jsonReq.data,
                                    resultType: 'noResults'
                                }
                            };
                        } else {
                            const tutorList = results.matches[0].metadata;
                            let related = [];
                            for (const key in tutorList) {
                                if (key.includes('relatedTeachers')) {
                                    const teacherId = key.slice(key.indexOf('.') + 1, key.lastIndexOf('.'));
                                    const propertyKey = key.slice(key.lastIndexOf('.') + 1);
                                    if (!related[teacherId]) related[teacherId] = {};
                                    related[teacherId][propertyKey] = tutorList[key];
                                    if (propertyKey === 'legacyId') {
                                        addProfessorToVD(btoa('Teacher-' + tutorList[key]));
                                    }
                                }
                            }
                            const teacherList = related.map(t => `${t.firstName} ${t.lastName} with average rating ${t.avgRating}`);
                            return {
                                success: true,
                                responseMessage: `Found multiple teachers similar to your search: ${teacherList.join(', ')}. Which one would you like more information about?`,
                                context: {
                                    operation: 'recommendTutors',
                                    searchTerm: jsonReq.data,
                                    resultType: 'success',
                                    relatedTeachers: related
                                }
                            };
                        }
                    } catch (error) {
                        console.error("Error in tutor recommendation:", error);
                        return {
                            success: false,
                            responseMessage: "An error occurred while recommending tutors.",
                            context: {
                                operation: 'recommendTutors',
                                searchTerm: jsonReq.data,
                                resultType: 'error',
                                error: error.message
                            }
                        };
                    }
                case 'parseTutor':
                    try {
                        let professorData = await getProfessorData(btoa('Teacher-' + jsonReq.data));
                        const teacher = professorData.data.node;
                        return {
                            success: true,
                            responseMessage: `Found teacher: ${teacher.firstName} ${teacher.lastName} from ${teacher.school.name} in the ${teacher.department} department. Their average rating is ${teacher.avgRating} and the would Take Again Percent is ${teacher.wouldTakeAgainPercent}. Course Codes: ${teacher.courseCodes.map(course => course.courseName).join(', ')}.`,
                            context: {
                                operation: 'parseTutor',
                                teacherId: jsonReq.data,
                                resultType: 'success',
                                teacherDetails: teacher
                            }
                        };
                    } catch (e) {
                        console.error("Error in finding tutor with id:", e);
                        return {
                            success: false,
                            responseMessage: "An error occurred while finding tutor with id.",
                            context: {
                                operation: 'parseTutor',
                                teacherId: jsonReq.data,
                                resultType: 'error',
                                error: e.message
                            }
                        };
                    }
            }
            break;
        }
        case 'upsert': {
            if (jsonReq.type === 'addTutorToVD') {
                try {
                    const result = await addProfessorToVD(btoa('Teacher-' + jsonReq.data));
                    if (result.success) {
                        return {
                            success: true,
                            responseMessage: `Successfully added/updated professor information for ${result.name}. Their current average rating is ${result.avgRating} based on ${result.numRatings} ratings.`,
                            context: {
                                operation: 'addTutorToVD',
                                teacherId: jsonReq.data,
                                resultType: 'success',
                                teacherDetails: result
                            }
                        };
                    } else {
                        return {
                            success: false,
                            responseMessage: `Sorry, but I failed to fetch that professor's data. Reason: ${result.reason}`,
                            context: {
                                operation: 'addTutorToVD',
                                teacherId: jsonReq.data,
                                resultType: 'error',
                                error: result.reason
                            }
                        };
                    }
                } catch (error) {
                    console.error("Error in professor upsert:", error);
                    return {
                        success: false,
                        responseMessage: "An error occurred while adding/updating professor information.",
                        context: {
                            operation: 'addTutorToVD',
                            teacherId: jsonReq.data,
                            resultType: 'error',
                            error: error.message
                        }
                    };
                }
            }
            break;
        }
        default:
            return {
                success: false,
                responseMessage: "Invalid operation.",
                context: {
                    operation: 'unknown',
                    resultType: 'error',
                    error: 'Invalid operation'
                }
            };
    }
}