export const simpleJson = {
    StartAt: 'NodeA',
    States: {
        NodeA: {
            Type: 'Task',
            Resource: 'arn',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    command: '',
                    task_name: 'NodeA',
                    timeout_minutes: '720',
                    processing_feature: 'CPU',
                    priority: 'REAL_TIME',
                    iam_role_arn: '',
                    'task_token.$': '',
                    'execution_arn.$': '',
                    'state_machine_arn.$': '',
                    'execution_start_date.$': '',
                    data: ''
                }
            },
            End: true
        }
    }
};

export const complexJson = {
    Comment: 'complex-json',
    StartAt: 'NodeA',
    States: {
        NodeA: {
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    task_name: 'task',
                    'log_id.$': '',
                    'task_token.$': '',
                    'state_machine_arn.$': '',
                    'execution_arn.$': ''
                }
            },
            Next: 'Choice'
        },
        Choice: {
            Type: 'Choice',
            Choices: [
                {
                    Variable: '',
                    StringGreaterThan: '',
                    Next: 'Parallel'
                },
                {
                    Variable: '',
                    StringEquals: '',
                    Next: 'SucceedNode'
                }
            ],
            Default: 'SucceedNode'
        },
        SucceedNode: {
            Type: 'Succeed'
        },
        Parallel: {
            Type: 'Parallel',
            End: true,
            Branches: [
                {
                    StartAt: 'NodeB',
                    States: {
                        NodeB: {
                            End: true,
                            Type: 'Task',
                            Resource: 'arn',
                            InputPath: '',
                            Parameters: {
                                FunctionName: 'arn',
                                Payload: {
                                    task_name: 'task',
                                    'log_id.$': '',
                                    'task_token.$': '',
                                    'state_machine_arn.$': '',
                                    'execution_arn.$': ''
                                }
                            }
                        }
                    }
                },
                {
                    StartAt: 'NodeC',
                    States: {
                        NodeC: {
                            Next: 'Map',
                            Type: 'Task',
                            Resource: 'arn',
                            InputPath: '',
                            Parameters: {
                                FunctionName: 'arn',
                                Payload: {
                                    task_name: 'task',
                                    'log_id.$': '',
                                    'task_token.$': '',
                                    'state_machine_arn.$': '',
                                    'execution_arn.$': ''
                                }
                            }
                        },
                        Map: {
                            Type: 'Map',
                            InputPath: '',
                            ItemsPath: '',
                            MaxConcurrency: 0,
                            Iterator: {
                                StartAt: 'MapNode',
                                States: {
                                    MapNode: {
                                        Type: 'Task',
                                        Resource: 'arn',
                                        End: true
                                    }
                                }
                            },
                            ResultPath: '',
                            End: true
                        }
                    }
                },
                {
                    StartAt: 'NodeD',
                    States: {
                        NodeD: {
                            Next: 'WaitNode',
                            Type: 'Task',
                            Resource: 'arn',
                            InputPath: '',
                            Parameters: {
                                FunctionName: 'arn',
                                Payload: {
                                    task_name: 'task',
                                    'log_id.$': '',
                                    'task_token.$': '',
                                    'state_machine_arn.$': '',
                                    'execution_arn.$': ''
                                }
                            }
                        },
                        WaitNode: {
                            Next: 'RetryNode',
                            Type: 'Wait',
                            Seconds: 10
                        },
                        RetryNode: {
                            Type: 'Task',
                            Next: 'FailNode',
                            Resource: 'arn',
                            InputPath: '',
                            Parameters: {
                                FunctionName: 'arn',
                                Payload: {
                                    task_name: 'task',
                                    'log_id.$': '',
                                    'task_token.$': '',
                                    'state_machine_arn.$': '',
                                    'execution_arn.$': ''
                                }
                            },
                            Retry: [
                                {
                                    ErrorEquals: ['States.Timeout', 'Lambda.Unknown'],
                                    IntervalSeconds: 1,
                                    MaxAttempts: 3,
                                    BackoffRate: 1
                                }
                            ]
                        },
                        FailNode: {
                            Type: 'Fail'
                        }
                    }
                }
            ]
        }
    }
};

export const choiceJson = {
    Comment: 'choice-json',
    StartAt: 'NodeA',
    States: {
        NodeA: {
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            ResultPath: '',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    command: '',
                    task_name: 'task',
                    timeout_minutes: '120',
                    processing_feature: 'CPU',
                    priority: 'BATCH',
                    iam_role_arn: '',
                    'task_token.$': '',
                    'execution_arn.$': '',
                    'state_machine_arn.$': '',
                    'execution_start_date.$': '',
                    data: ''
                }
            },
            Next: 'NodeB'
        },
        NodeB: {
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            ResultPath: '',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    task_name: 'task',
                    timeout_minutes: '120',
                    processing_feature: 'CPU',
                    priority: 'BATCH',
                    iam_role_arn: '',
                    'task_token.$': '',
                    'execution_arn.$': '',
                    'state_machine_arn.$': '',
                    'execution_start_date.$': '',
                    'data.$': ''
                }
            },
            Next: 'Choice'
        },
        Choice: {
            Type: 'Choice',
            Choices: [
                {
                    Not: {
                        Variable: '',
                        StringEquals: ''
                    },
                    Next: 'NodeC'
                },
                {
                    Variable: '',
                    StringEquals: '',
                    Next: 'NodeD'
                }
            ],
            Default: 'NodeD'
        },
        NodeD: {
            Type: 'Succeed'
        },
        NodeC: {
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            ResultPath: '',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    command: '',
                    task_name: 'task',
                    timeout_minutes: '120',
                    processing_feature: 'CPU',
                    priority: 'BATCH',
                    iam_role_arn: '',
                    'task_token.$': '',
                    'execution_arn.$': '',
                    'state_machine_arn.$': '',
                    'execution_start_date.$': '',
                    'data.$': ''
                }
            },
            Next: 'Map'
        },
        Map: {
            Type: 'Map',
            ItemsPath: '',
            ResultPath: '',
            Iterator: {
                StartAt: 'NodeE',
                States: {
                    NodeE: {
                        Type: 'Task',
                        Resource: 'arn',
                        InputPath: '',
                        ResultPath: '',
                        Parameters: {
                            FunctionName: 'arn',
                            Payload: {
                                command: '',
                                task_name: 'task',
                                timeout_minutes: '120',
                                processing_feature: 'CPU',
                                priority: 'BATCH',
                                iam_role_arn: '',
                                'task_token.$': '',
                                'execution_arn.$': '',
                                'state_machine_arn.$': '',
                                'execution_start_date.$': '',
                                'data.$': ''
                            }
                        },
                        End: true
                    }
                }
            },
            End: true
        }
    }
};

export const longJson = {
    Comment: 'long-json',
    StartAt: 'Task',
    States: {
        Task: {
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            ResultPath: '',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    task_name: 'Task'
                }
            },
            Next: 'Choice'
        },
        Choice: {
            Type: 'Choice',
            Choices: [
                {
                    Next: 'Parallel'
                },
                {
                    Next: 'NodeA'
                },
                {
                    Next: 'Node1'
                }
            ],
            Default: 'NodeA'
        },
        NodeA: {
            Next: 'NodeB',
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    task_name: 'NodeA'
                }
            }
        },
        NodeB: {
            Next: 'NodeC',
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    task_name: 'NodeB'
                }
            }
        },
        NodeC: {
            Next: 'NodeD',
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    task_name: 'NodeC'
                }
            }
        },
        NodeD: {
            Next: 'Succeed',
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    task_name: 'NodeD'
                }
            }
        },
        Succeed: {
            Type: 'Succeed'
        },
        Parallel: {
            Type: 'Parallel',
            Next: 'AfterParallel',
            Branches: [
                {
                    StartAt: 'ParallelA',
                    States: {
                        ParallelA: {
                            End: true,
                            Type: 'Task',
                            Resource: 'arn',
                            InputPath: '',
                            ResultPath: '',
                            Parameters: {
                                FunctionName: 'arn',
                                Payload: {
                                    task_name: 'ParallelA'
                                }
                            }
                        }
                    }
                },
                {
                    StartAt: 'ParallelB',
                    States: {
                        ParallelB: {
                            End: true,
                            Type: 'Task',
                            Resource: 'arn',
                            InputPath: '',
                            ResultPath: '',
                            Parameters: {
                                FunctionName: 'arn',
                                Payload: {
                                    task_name: 'ParallelB'
                                }
                            }
                        }
                    }
                },
                {
                    StartAt: 'ParallelC',
                    States: {
                        ParallelC: {
                            End: true,
                            Type: 'Task',
                            Resource: 'arn',
                            InputPath: '',
                            ResultPath: '',
                            Parameters: {
                                FunctionName: 'arn',
                                Payload: {
                                    task_name: 'ParallelC'
                                }
                            }
                        }
                    }
                }
            ]
        },
        AfterParallel: {
            End: true,
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            Parameters: {
                FunctionName: 'arn',
                Payload: {
                    task_name: 'AfterParallel'
                }
            }
        }
    }
};

export const mapInMap = {
    StartAt: 'NodeA',
    States: {
        NodeA: {
            Type: 'Task',
            Resource: 'arn',
            InputPath: '',
            Next: 'MapA'
        },
        MapA: {
            Type: 'Map',
            Iterator: {
                StartAt: 'MapNode',
                States: {
                    MapNode: {
                        Type: 'Task',
                        Resource: 'arn',
                        InputPath: '',
                        Parameters: {
                            FunctionName: 'arn',
                            Payload: {
                                command: '',
                                command_params: {},
                                task_name: 'task',
                                timeout_minutes: '720',
                                processing_feature: 'CPU',
                                priority: 'REAL_TIME',
                                iam_role_arn: '',
                                'task_token.$': '',
                                'execution_arn.$': ''
                            }
                        },
                        Next: 'MapB'
                    },
                    MapB: {
                        Type: 'Map',
                        Iterator: {
                            StartAt: 'InnerMapNode',
                            States: {
                                InnerMapNode: {
                                    Type: 'Task',
                                    Resource: 'arn',
                                    Retry: [{}],
                                    InputPath: '',
                                    Parameters: {
                                        FunctionName: 'arn',
                                        Payload: {
                                            command: '',
                                            command_params: {},
                                            task_name: 'task',
                                            timeout_minutes: '720',
                                            processing_feature: 'CPU',
                                            priority: 'REAL_TIME',
                                            iam_role_arn: '',
                                            'task_token.$': '',
                                            'execution_arn.$': '',
                                            'state_machine_arn.$': ''
                                        }
                                    },
                                    End: true
                                }
                            }
                        },
                        Next: 'NodeB'
                    },
                    NodeB: {
                        Type: 'Task',
                        Resource: 'arn',
                        InputPath: '',
                        Parameters: {
                            FunctionName: 'arn',
                            Payload: {
                                command: '',
                                command_params: {},
                                task_name: 'task',
                                timeout_minutes: '720',
                                processing_feature: 'CPU',
                                priority: 'BATCH',
                                iam_role_arn: '',
                                'task_token.$': '',
                                'execution_arn.$': '',
                                'state_machine_arn.$': ''
                            }
                        },
                        End: true
                    }
                }
            },
            End: true
        }
    }
};
