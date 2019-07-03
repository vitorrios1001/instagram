import React, { Component } from 'react';
import api from '../services/api'
import io from 'socket.io-client'
import './Feed.css';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';
import { HOST } from '../_config/constants';


class Feed extends Component {
    state = {
        feed: []
    }

    handleLike = async idPost => {
        await api.post(`/posts/${idPost}/like`)
    }

    registerToSocket = () => {
        const socket = io(`http://${HOST}:4000`)

        socket.on('post', newPost => {
            this.setState({ feed: [newPost, ...this.state.feed] });
        })

        socket.on('like', likedPost => {
            this.setState({
                feed: this.state.feed.map(post =>
                    post._id === likedPost._id ? likedPost : post
                )
            });
        })
    }

    async componentDidMount() {
        this.registerToSocket();

        const { data } = await api.get('/posts');

        this.setState({ feed: data });
        console.log(this.state)
    }

    render() {

        const { feed } = this.state;

        return (
            <section id="post-list">
                {
                    feed.map(post => (
                        <article key={post._id}>
                            <header>
                                <div className="user-info">
                                    <span>{post.author}</span>
                                    <span className="place">{post.place}</span>
                                </div>

                                <img src={more} alt="Mais" />
                            </header>

                            <img
                                src={`http://${HOST}:4000/files/${post.image}`}
                                onDoubleClick={() => this.handleLike(post._id)}
                            />

                            <footer>
                                <div className="actions">

                                    <button type='button' onClick={() => this.handleLike(post._id)}>
                                        <img src={like} alt="like" />
                                    </button>

                                    <img src={comment} alt="comment" />
                                    <img src={send} alt="send" />

                                </div>
                                <strong>{post.likes} Curtidas</strong>
                                <p>
                                    {post.description}
                                    <span>{post.hashtags}</span>
                                </p>

                            </footer>
                        </article>
                    ))
                }
            </section>
        )
    }
}

export default Feed;