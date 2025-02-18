import { StoreService } from '../../src/service/store.service';
import { StoreModel } from '../../src/models/store.model';
import { AppError } from '../../src/utils/appError';
import { CreateStoreDto } from '../../src/dtos/storeDto/createStore.dto';
import { UpdateStoreDto } from '../../src/dtos/storeDto/updateStore.dto';

jest.mock('../models/store.model'); 

describe('StoreService', () => {
  const mockCreateStoreDto: CreateStoreDto = {
    name: 'Test Store',
    description: 'A store for testing',
  };

  const mockUpdateStoreDto: UpdateStoreDto = {
    name: 'Updated Store',
    description: 'An updated description for testing',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new store', async () => {
    const mockStore = { ...mockCreateStoreDto, owner: '123' };
    (StoreModel.create as jest.Mock).mockResolvedValue(mockStore);

    const newStore = await StoreService.createStore(mockCreateStoreDto, '123');
    
    expect(newStore).toEqual(mockStore);
    expect(StoreModel.create).toHaveBeenCalledWith({
      ...mockCreateStoreDto,
      owner: '123',
    });
  });

  it('should throw an error if store already exists', async () => {
    (StoreModel.findOne as jest.Mock).mockResolvedValueOnce(true);

    await expect(StoreService.createStore(mockCreateStoreDto, '123')).rejects.toThrowError(
      new AppError('Store already exists with that name', 400)
    );
  });

  it('should update a store', async () => {
    const mockStore = { _id: '1', ...mockCreateStoreDto, owner: '123' };
    (StoreModel.findOne as jest.Mock).mockResolvedValue(mockStore);
    (StoreModel.findOne as jest.Mock).mockResolvedValue(mockStore);

    const updatedStore = await StoreService.updateStore('1', mockUpdateStoreDto, '123');

    expect(updatedStore.name).toBe(mockUpdateStoreDto.name);
    expect(StoreModel.findOne).toHaveBeenCalledWith({
      _id: '1',
      owner: '123',
      isDeleted: { $ne: true },
    });
  });

  it('should throw an error when updating a store that doesn’t exist', async () => {
    (StoreModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(StoreService.updateStore('999', mockUpdateStoreDto, '123')).rejects.toThrowError(
      new AppError('Store not found or you are not authorized to update it', 404)
    );
  });

  it('should delete a store', async () => {
    const mockStore = { _id: '1', isDeleted: false, owner: '123' };
    (StoreModel.findOne as jest.Mock).mockResolvedValue(mockStore);

    const result = await StoreService.deleteStore('1', '123');
    
    expect(result.message).toBe('Store deleted successfully');
    expect(StoreModel.findOne).toHaveBeenCalledWith({
      _id: '1',
      owner: '123',
      isDeleted: { $ne: true },
    });
  });

  it('should throw an error when trying to delete a non-existent store', async () => {
    (StoreModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(StoreService.deleteStore('999', '123')).rejects.toThrowError(
      new AppError('Store not found or you are not authorized to delete it', 404)
    );
  });
});
