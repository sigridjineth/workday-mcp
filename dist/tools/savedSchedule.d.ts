import { z } from "zod";
export declare const SavedScheduleItemSchema: z.ZodObject<{
    academicPeriod: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    units: z.ZodNumber;
    gradingBasis: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>>;
    courseListing: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    courseSections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    academicPeriod: {
        id: string;
    };
    units: number;
    courseListing: {
        id: string;
    };
    courseSections: {
        id: string;
    }[];
    gradingBasis?: {
        id: string;
    } | undefined;
}, {
    academicPeriod: {
        id: string;
    };
    units: number;
    courseListing: {
        id: string;
    };
    courseSections: {
        id: string;
    }[];
    gradingBasis?: {
        id: string;
    } | undefined;
}>;
export declare const SavedSchedulePayloadSchema: z.ZodObject<{
    name: z.ZodString;
    academicPeriod: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    academicRecord: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    items: z.ZodArray<z.ZodObject<{
        academicPeriod: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        units: z.ZodNumber;
        gradingBasis: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>>;
        courseListing: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        courseSections: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        academicPeriod: {
            id: string;
        };
        units: number;
        courseListing: {
            id: string;
        };
        courseSections: {
            id: string;
        }[];
        gradingBasis?: {
            id: string;
        } | undefined;
    }, {
        academicPeriod: {
            id: string;
        };
        units: number;
        courseListing: {
            id: string;
        };
        courseSections: {
            id: string;
        }[];
        gradingBasis?: {
            id: string;
        } | undefined;
    }>, "many">;
    unavailableTimes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodLiteral<"Unavailable">;
        daysOfTheWeek: z.ZodArray<z.ZodString, "many">;
        startTime: z.ZodString;
        endTime: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: "Unavailable";
        daysOfTheWeek: string[];
        startTime: string;
        endTime: string;
    }, {
        name: "Unavailable";
        daysOfTheWeek: string[];
        startTime: string;
        endTime: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    items: {
        academicPeriod: {
            id: string;
        };
        units: number;
        courseListing: {
            id: string;
        };
        courseSections: {
            id: string;
        }[];
        gradingBasis?: {
            id: string;
        } | undefined;
    }[];
    academicPeriod: {
        id: string;
    };
    academicRecord: {
        id: string;
    };
    unavailableTimes?: {
        name: "Unavailable";
        daysOfTheWeek: string[];
        startTime: string;
        endTime: string;
    }[] | undefined;
}, {
    name: string;
    items: {
        academicPeriod: {
            id: string;
        };
        units: number;
        courseListing: {
            id: string;
        };
        courseSections: {
            id: string;
        }[];
        gradingBasis?: {
            id: string;
        } | undefined;
    }[];
    academicPeriod: {
        id: string;
    };
    academicRecord: {
        id: string;
    };
    unavailableTimes?: {
        name: "Unavailable";
        daysOfTheWeek: string[];
        startTime: string;
        endTime: string;
    }[] | undefined;
}>;
export declare const ValidateSavedScheduleCreateInput: z.ZodObject<{
    payload: z.ZodObject<{
        name: z.ZodString;
        academicPeriod: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        academicRecord: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        items: z.ZodArray<z.ZodObject<{
            academicPeriod: z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
            units: z.ZodNumber;
            gradingBasis: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>>;
            courseListing: z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
            courseSections: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }, {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }>, "many">;
        unavailableTimes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodLiteral<"Unavailable">;
            daysOfTheWeek: z.ZodArray<z.ZodString, "many">;
            startTime: z.ZodString;
            endTime: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }, {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    }, {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    payload: {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    };
}, {
    payload: {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    };
}>;
export declare function validateSavedScheduleCreate(input: z.infer<typeof ValidateSavedScheduleCreateInput>): Promise<unknown>;
export declare const CreateSavedScheduleInput: z.ZodObject<{
    payload: z.ZodObject<{
        name: z.ZodString;
        academicPeriod: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        academicRecord: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        items: z.ZodArray<z.ZodObject<{
            academicPeriod: z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
            units: z.ZodNumber;
            gradingBasis: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>>;
            courseListing: z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
            courseSections: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }, {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }>, "many">;
        unavailableTimes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodLiteral<"Unavailable">;
            daysOfTheWeek: z.ZodArray<z.ZodString, "many">;
            startTime: z.ZodString;
            endTime: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }, {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    }, {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    }>;
    confirmationToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    payload: {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    };
    confirmationToken: string;
}, {
    payload: {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    };
    confirmationToken: string;
}>;
export declare function createSavedSchedule(input: z.infer<typeof CreateSavedScheduleInput>): Promise<unknown>;
export declare const GetSavedScheduleInput: z.ZodObject<{
    scheduleWid: z.ZodString;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    scheduleWid: string;
    params?: Record<string, string> | undefined;
}, {
    scheduleWid: string;
    params?: Record<string, string> | undefined;
}>;
export declare function getSavedSchedule(input: z.infer<typeof GetSavedScheduleInput>): Promise<unknown>;
export declare const ValidateSavedScheduleUpdateInput: z.ZodObject<{
    scheduleWid: z.ZodString;
    payload: z.ZodObject<{
        name: z.ZodString;
        academicPeriod: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        academicRecord: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        items: z.ZodArray<z.ZodObject<{
            academicPeriod: z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
            units: z.ZodNumber;
            gradingBasis: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>>;
            courseListing: z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
            courseSections: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }, {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }>, "many">;
        unavailableTimes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodLiteral<"Unavailable">;
            daysOfTheWeek: z.ZodArray<z.ZodString, "many">;
            startTime: z.ZodString;
            endTime: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }, {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    }, {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    payload: {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    };
    scheduleWid: string;
}, {
    payload: {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    };
    scheduleWid: string;
}>;
export declare function validateSavedScheduleUpdate(input: z.infer<typeof ValidateSavedScheduleUpdateInput>): Promise<unknown>;
export declare const UpdateSavedScheduleInput: z.ZodObject<{
    scheduleWid: z.ZodString;
    payload: z.ZodObject<{
        name: z.ZodString;
        academicPeriod: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        academicRecord: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        items: z.ZodArray<z.ZodObject<{
            academicPeriod: z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
            units: z.ZodNumber;
            gradingBasis: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>>;
            courseListing: z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
            courseSections: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }, {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }>, "many">;
        unavailableTimes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodLiteral<"Unavailable">;
            daysOfTheWeek: z.ZodArray<z.ZodString, "many">;
            startTime: z.ZodString;
            endTime: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }, {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    }, {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    }>;
    confirmationToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    payload: {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    };
    confirmationToken: string;
    scheduleWid: string;
}, {
    payload: {
        name: string;
        items: {
            academicPeriod: {
                id: string;
            };
            units: number;
            courseListing: {
                id: string;
            };
            courseSections: {
                id: string;
            }[];
            gradingBasis?: {
                id: string;
            } | undefined;
        }[];
        academicPeriod: {
            id: string;
        };
        academicRecord: {
            id: string;
        };
        unavailableTimes?: {
            name: "Unavailable";
            daysOfTheWeek: string[];
            startTime: string;
            endTime: string;
        }[] | undefined;
    };
    confirmationToken: string;
    scheduleWid: string;
}>;
export declare function updateSavedSchedule(input: z.infer<typeof UpdateSavedScheduleInput>): Promise<unknown>;
//# sourceMappingURL=savedSchedule.d.ts.map