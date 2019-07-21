import React, { Component } from 'react';
import api from '../services/api'
import io from 'socket.io-client'
import './Feed.css';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';
import { HOST } from '../_config/constants';
import { Popconfirm } from 'antd';


class Feed extends Component {
    state = {
        feed: []
    }

    handleLike = async idPost => {
        await api.post(`/posts/${idPost}/like`)
    }

    registerToSocket = () => {
        const socket = io(`https://${HOST}`)

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

    handleRemove = async idPost => {
        await api.delete(`/posts/${idPost}`)
        this.setState({ feed: this.state.feed.filter(item => item._id !== idPost) })
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
                                <Popconfirm
                                    title="Tem certeza que deseja excluir esse post?"
                                    placement="bottomRight"
                                    onConfirm={() => this.handleRemove(post._id)}
                                    // onCancel={cancel}
                                    okText="Sim"
                                    cancelText="Não"
                                >
                                    <img src={more} alt="Mais" />
                                </Popconfirm>
                            </header>

                            <img
                                src={`${post.image}`}
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