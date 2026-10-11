import { apiRequest } from './client';

const DEMO_ITEMS_KEY = 'findit_demo_items';

const INITIAL_DEMO_ITEMS = [
  {
    _id: 'item-101',
    id: 'item-101',
    title: 'Blue Herschel Classic Backpack',
    type: 'FOUND',
    category: 'Bags & Backpacks',
    status: 'OPEN',
    description: 'Dark blue backpack with brown leather accents. Contains a spiral notebook and water bottle.',
    location: 'Central Library, 2nd Floor Study Room 204',
    date: '2026-10-10',
    contact: 'library-frontdesk@campus.edu',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    user: {
      id: 'usr-admin-1',
      name: 'Team Admin',
      email: 'admin@findit.com',
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'item-102',
    id: 'item-102',
    title: 'iPhone 14 Pro (Space Black)',
    type: 'LOST',
    category: 'Electronics',
    status: 'OPEN',
    description: 'Has a transparent case with a green dinosaur sticker on the back. Lock screen shows a mountain wallpaper.',
    location: 'Campus Dining Hall, Booth 12',
    date: '2026-10-09',
    contact: 'john.doe@student.edu | +1-555-0199',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    user: {
      id: 'usr-demo-1',
      name: 'John Doe',
      email: 'user@findit.com',
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: 'item-103',
    id: 'item-103',
    title: 'Student ID Card & Dorm Keycard',
    type: 'FOUND',
    category: 'Cards & IDs',
    status: 'CLAIMED',
    description: 'University Student ID inside a black lanyard along with an RFID dorm access keycard.',
    location: 'Engineering Hallway, Room 302 Bench',
    date: '2026-10-08',
    contact: 'security@campus.edu',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    user: {
      id: 'usr-admin-1',
      name: 'Team Admin',
      email: 'admin@findit.com',
    },
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    _id: 'item-104',
    id: 'item-104',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    type: 'LOST',
    category: 'Electronics',
    status: 'OPEN',
    description: 'Black over-ear headphones inside their original grey carrying case with USB-C cable.',
    location: 'Sports Complex / Gym Locker Area',
    date: '2026-10-10',
    contact: 'user@findit.com',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    user: {
      id: 'usr-demo-1',
      name: 'John Doe',
      email: 'user@findit.com',
    },
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    _id: 'item-105',
    id: 'item-105',
    title: 'Fossil Brown Leather Bi-fold Wallet',
    type: 'FOUND',
    category: 'Wallets & Purses',
    status: 'OPEN',
    description: 'Dark brown leather wallet with initials "M.K." embossed. Handed to security guard.',
    location: 'Student Union Lounge near coffee shop',
    date: '2026-10-11',
    contact: 'union-security@campus.edu',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    user: {
      id: 'usr-admin-1',
      name: 'Team Admin',
      email: 'admin@findit.com',
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'item-106',
    id: 'item-106',
    title: 'Car Keys with Subaru Key Fob',
    type: 'LOST',
    category: 'Keys',
    status: 'CLOSED',
    description: 'Set of 3 brass keys and one black Subaru remote fob with a red miniature carabiner.',
    location: 'North Lot 4, Row C',
    date: '2026-10-06',
    contact: 'john.doe@student.edu',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    user: {
      id: 'usr-demo-1',
      name: 'John Doe',
      email: 'user@findit.com',
    },
    createdAt: new Date(Date.now() - 400000000).toISOString(),
  },
];

function getLocalDemoItems() {
  const stored = localStorage.getItem(DEMO_ITEMS_KEY);
  if (!stored) {
    localStorage.setItem(DEMO_ITEMS_KEY, JSON.stringify(INITIAL_DEMO_ITEMS));
    return [...INITIAL_DEMO_ITEMS];
  }
  return JSON.parse(stored);
}

function saveLocalDemoItems(items) {
  localStorage.setItem(DEMO_ITEMS_KEY, JSON.stringify(items));
}

/**
 * Fetch all items (public or admin query)
 * GET /api/items
 */
export async function fetchItems(params = {}) {
  const query = new URLSearchParams();
  if (params.type && params.type !== 'ALL') query.set('type', params.type);
  if (params.status && params.status !== 'ALL') query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.category && params.category !== 'ALL') query.set('category', params.category);

  const queryString = query.toString() ? `?${query.toString()}` : '';

  try {
    const data = await apiRequest(`/items${queryString}`);
    return Array.isArray(data) ? data : data.items || [];
  } catch (error) {
    if (error.isNetworkError || error.status === 404) {
      let items = getLocalDemoItems();
      if (params.type && params.type !== 'ALL') {
        items = items.filter((i) => i.type.toUpperCase() === params.type.toUpperCase());
      }
      if (params.status && params.status !== 'ALL') {
        items = items.filter((i) => i.status.toUpperCase() === params.status.toUpperCase());
      }
      if (params.category && params.category !== 'ALL') {
        items = items.filter((i) => i.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (i) =>
            i.title.toLowerCase().includes(s) ||
            i.description.toLowerCase().includes(s) ||
            i.location.toLowerCase().includes(s)
        );
      }
      return items;
    }
    throw error;
  }
}

/**
 * Fetch items reported by logged in user
 * GET /api/items/mine
 */
export async function fetchMyItems(currentUserId) {
  try {
    const data = await apiRequest('/items/mine');
    return Array.isArray(data) ? data : data.items || [];
  } catch (error) {
    if (error.isNetworkError || error.status === 404) {
      const allItems = getLocalDemoItems();
      return allItems.filter((i) => {
        const uId = i.user?.id || i.user?._id || i.userId;
        return uId === currentUserId || (!uId && currentUserId === 'usr-demo-1');
      });
    }
    throw error;
  }
}

/**
 * Fetch single item by ID
 * GET /api/items/:id
 */
export async function fetchItemById(id) {
  try {
    return await apiRequest(`/items/${id}`);
  } catch (error) {
    if (error.isNetworkError || error.status === 404) {
      const items = getLocalDemoItems();
      const found = items.find((i) => i._id === id || i.id === id);
      if (!found) throw new Error('Item not found');
      return found;
    }
    throw error;
  }
}

/**
 * Create a new item report
 * POST /api/items
 */
export async function createItem(itemData, currentUser) {
  try {
    return await apiRequest('/items', {
      method: 'POST',
      body: itemData,
    });
  } catch (error) {
    if (error.isNetworkError || error.status === 404) {
      const items = getLocalDemoItems();
      const newItem = {
        _id: `item-${Date.now()}`,
        id: `item-${Date.now()}`,
        ...itemData,
        status: itemData.status || 'OPEN',
        user: {
          id: currentUser?.id || 'usr-demo-1',
          name: currentUser?.name || 'Logged User',
          email: currentUser?.email || 'user@findit.com',
        },
        createdAt: new Date().toISOString(),
      };
      items.unshift(newItem);
      saveLocalDemoItems(items);
      return newItem;
    }
    throw error;
  }
}

/**
 * Update item details (Owner)
 * PUT /api/items/:id
 */
export async function updateItem(id, updateData) {
  try {
    return await apiRequest(`/items/${id}`, {
      method: 'PUT',
      body: updateData,
    });
  } catch (error) {
    if (error.isNetworkError || error.status === 404) {
      const items = getLocalDemoItems();
      const index = items.findIndex((i) => i._id === id || i.id === id);
      if (index === -1) throw new Error('Item not found');
      items[index] = { ...items[index], ...updateData };
      saveLocalDemoItems(items);
      return items[index];
    }
    throw error;
  }
}

/**
 * Update item status (Admin)
 * PUT /api/items/:id/status
 */
export async function updateItemStatus(id, status) {
  try {
    return await apiRequest(`/items/${id}/status`, {
      method: 'PUT',
      body: { status },
    });
  } catch (error) {
    if (error.isNetworkError || error.status === 404) {
      const items = getLocalDemoItems();
      const index = items.findIndex((i) => i._id === id || i.id === id);
      if (index === -1) throw new Error('Item not found');
      items[index].status = status;
      saveLocalDemoItems(items);
      return items[index];
    }
    throw error;
  }
}

/**
 * Delete item report (Owner or Admin)
 * DELETE /api/items/:id
 */
export async function deleteItem(id) {
  try {
    return await apiRequest(`/items/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    if (error.isNetworkError || error.status === 404) {
      let items = getLocalDemoItems();
      items = items.filter((i) => i._id !== id && i.id !== id);
      saveLocalDemoItems(items);
      return { message: 'Item deleted successfully' };
    }
    throw error;
  }
}
