import React, {useState, useEffect} from 'react';
import {Search, Plus, Edit2, Trash2, X, Check, AlertCircle} from 'lucide-react';
import {wordService} from "./services/wordService.js";
import {WORD_TYPES} from "./wordTypes.js";
import './index.css'

function App() {
    const [words, setWords] = useState([]);
    const [wordTypes , setWordTypes] = useState([])
    const [filteredWords, setFilteredWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWord, setEditingWord] = useState(null);

    // Fetch words on mount
    useEffect(() => {
        loadWords();
    }, [])

    useEffect(() => {
        loadWordTypes()
    }, [])

    // Filter words when search or type changes
    useEffect(() => {
        filterWords();
    }, [words, searchTerm, selectedType]);

    const loadWords = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await wordService.getAllWords();
            setWords(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadWordTypes = async () => {
        try {
            setLoading(true);
            const data = await wordService.getAllWordTypes();
            setWordTypes(data)
        }catch (err){
            setError(err)
        }finally {
            setLoading(false)
        }
    }

    const filterWords = () => {
        let filtered = words;

        if (searchTerm) {
            filtered = filtered.filter(word =>
                word.word.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedType !== 'All') {
            filtered = filtered.filter(word => word.type === selectedType);
        }

        setFilteredWords(filtered);
    };

    const handleAddWord = () => {
        setEditingWord(null);
        setIsModalOpen(true);
    };

    const handleEditWord = (word) => {
        setEditingWord(word);
        setIsModalOpen(true);
    };

    const handleDeleteWord = async (id) => {
        if (!window.confirm('Are you sure you want to delete this word?')) return;

        try {
            await wordService.deleteWord(id);
            setWords(words.filter(w => w.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSaveWord = async (wordData) => {
        try {
            if (editingWord) {
                const updated = await wordService.updateWord(editingWord.id, wordData);
                console.log(updated)
                setWords(words.map(w => w.id === editingWord.id ? updated : w));
            } else {
                const created = await wordService.createWord(wordData);
                setWords([...words, created]);
            }
            setIsModalOpen(false);
            setEditingWord(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Word Collection Manager
                    </h1>
                    <p className="text-gray-600">
                        Build and manage your vocabulary collection by word types
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                        <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="text-red-800 font-semibold">Error</h3>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search words..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="All">All Types</option>
                            {wordTypes?.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        {/* Add Button */}
                        <button
                            onClick={handleAddWord}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Add Word
                        </button>
                    </div>
                </div>

                {/* Word List */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading words...</p>
                        </div>
                    ) : filteredWords.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No words found</p>
                            <p className="text-gray-400 text-sm mt-2">
                                {words.length === 0
                                    ? 'Start by adding your first word!'
                                    : 'Try adjusting your search or filter'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredWords.map(word => (
                                <WordCard
                                    key={word.id}
                                    word={word}
                                    onEdit={handleEditWord}
                                    onDelete={handleDeleteWord}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Footer */}
                <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Total Words: {words.length}</span>
                        <span>Filtered Results: {filteredWords.length}</span>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <WordModal
                    word={editingWord}
                    onSave={handleSaveWord}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingWord(null);
                    }}
                />
            )}
        </div>
    );
}

// Word Card Component
function WordCard({ word, onEdit, onDelete }) {
    const typeColors = {
        Noun: 'bg-blue-100 text-blue-800',
        Verb: 'bg-green-100 text-green-800',
        Adjective: 'bg-purple-100 text-purple-800',
        Adverb: 'bg-yellow-100 text-yellow-800',
        Pronoun: 'bg-pink-100 text-pink-800',
        Preposition: 'bg-indigo-100 text-indigo-800',
        Interjection: 'bg-red-100 text-red-800',
        Conjunction: 'bg-orange-100 text-orange-800',
        Determiner: 'bg-teal-100 text-teal-800'
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800 break-words">
                    {word.word}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(word)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(word.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${typeColors[word.type]}`}>
        {word.type}
      </span>
        </div>
    );
}

// Word Modal Component
function WordModal({ word, onSave, onClose }) {
    const [formData, setFormData] = useState({
        word: word?.word || '',
        type: word?.type || 'Noun'
    });
    const [errors, setErrors] = useState({});
    const [wordTypes , setWordTypes] = useState([])

    useEffect(() => {
        loadWordTypes();
    }, []);

    const loadWordTypes = async () => {
        try {
            const data = await wordService.getAllWordTypes();
            setWordTypes(data)
        }catch (err){
            setErrors(err)
        }
    }


    const validate = () => {
        const newErrors = {};
        if (!formData.word.trim()) {
            newErrors.word = 'Word is required';
        } else if (formData.word.trim().length < 2) {
            newErrors.word = 'Word must be at least 2 characters';
        }
        if (!formData.type) {
            newErrors.type = 'Type is required';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length === 0) {
            onSave({
                word: formData.word.trim(),
                type: formData.type
            });
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {word ? 'Edit Word' : 'Add New Word'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Word *
                        </label>
                        <input
                            type="text"
                            value={formData.word}
                            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                                errors.word ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter a word"
                        />
                        {errors.word && (
                            <p className="text-red-500 text-sm mt-1">{errors.word}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Word Type *
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                                errors.type ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            {wordTypes?.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.type && (
                            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Check size={20} />
                            {word ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App
