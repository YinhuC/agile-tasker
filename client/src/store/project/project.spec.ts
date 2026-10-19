import {
  CreateProjectParams,
  GetProjectsParams,
  Project,
  UpdateProjectParams,
} from '../../types/project.types';
import { store } from '..';
import {
  fetchAllProjectsThunk,
  fetchProjectThunk,
  createProjectThunk,
  updateProjectThunk,
  deleteProjectThunk,
} from './project.thunks';
import API from '../../api';

vi.mock('../../api', () => ({
  default: {
    project: {
      getAllProjects: vi.fn(),
      getProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
    },
  },
}));

describe('Project Thunks', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches createProjectThunk correctly', async () => {
    const params: CreateProjectParams = { name: 'New Project', groupId: 1 };
    const createProjectMock = vi
      .fn()
      .mockResolvedValue({ data: { id: 1, ...params } });
    const projectModule = vi.mocked(API.project);
    projectModule.createProject.mockImplementation(createProjectMock);

    await store.dispatch(createProjectThunk(params));

    expect(createProjectMock).toHaveBeenCalledWith(params);
    expect(store.getState().projects).toEqual({
      projects: [{ id: 1, ...params }],
    });
  });

  it('dispatches updateProjectThunk correctly', async () => {
    const projectId = 1;
    const updatedProject: UpdateProjectParams = {
      id: projectId,
      name: 'Updated Project',
    };

    const updateProjectMock = vi
      .fn()
      .mockResolvedValue({ data: updatedProject });

    const projectModule = vi.mocked(API.project);
    projectModule.updateProject.mockImplementation(updateProjectMock);

    await store.dispatch(updateProjectThunk(updatedProject));

    expect(updateProjectMock).toHaveBeenCalledWith(updatedProject);
    expect(store.getState().projects).toEqual({
      projects: [updatedProject],
    });
  });

  it('dispatches fetchAllProjectsThunk correctly', async () => {
    const mockProjects: Project[] = [
      {
        id: 1,
        name: 'Project 1',
        description: 'description',
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      },
    ];
    const getProjectsMock = vi.fn().mockResolvedValue({ data: mockProjects });
    const projectModule = vi.mocked(API.project);
    projectModule.getAllProjects.mockImplementation(getProjectsMock);

    const params: GetProjectsParams = { groupId: 1 };

    await store.dispatch(fetchAllProjectsThunk(params));

    expect(getProjectsMock).toHaveBeenCalledWith(params);
    expect(store.getState().projects).toEqual({ projects: mockProjects });
  });

  it('dispatches fetchProjectThunk correctly', async () => {
    const projectId = 1;
    const mockProject: Project = {
      id: 1,
      name: 'Project 1',
      description: 'description',
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
    const getProjectMock = vi.fn().mockResolvedValue({ data: mockProject });
    const projectModule = vi.mocked(API.project);
    projectModule.getProject.mockImplementation(getProjectMock);

    await store.dispatch(fetchProjectThunk(projectId.toString()));

    expect(getProjectMock).toHaveBeenCalledWith(projectId.toString());
    expect(store.getState().projects).toEqual({ projects: [mockProject] });
  });

  it('dispatches deleteProjectThunk correctly', async () => {
    const projectId = 1;
    const deleteProjectMock = vi
      .fn()
      .mockResolvedValue({ data: { id: projectId } });
    const projectModule = vi.mocked(API.project);
    projectModule.deleteProject.mockImplementation(deleteProjectMock);

    await store.dispatch(deleteProjectThunk(projectId.toString()));

    expect(deleteProjectMock).toHaveBeenCalledWith(projectId.toString());
    expect(store.getState().projects).toEqual({
      projects: [],
    });
  });
});
